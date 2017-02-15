// THIS IS NOT PART OF THE APP; IT'S PART OF THE BUILD SYSTEM.
/* global __dirname */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function LinkWatcher(config) {
    if (config.module !== undefined) {
        // We want a specific module
        if (fs.lstatSync("./node_modules/" + config.module).isSymbolicLink()) {
            // Now that we've found it, let's follow the white rabbit...
            // Step out of the "lib/node_modules/" subdirectory of the project (thanks, npm link)
            this.module_path = path.resolve("./node_modules/" + fs.readlinkSync("./node_modules/" + config.module) + "/../../../");
            this.module = config.module;
        } else {
            console.log(config.module + " is not symlinked, so will not be automatically watched.");
            this.module = false;
        }
    }

    this.watchDirectory = config.watchDirectory;
    this.npmCommand = config.npmCommand;
    this.action = "npm";
    this.args = ["--prefix=./node_modules/" + this.module, "run", this.npmCommand];
    this.outputDirectory = config.outputDirectory;
}

function directoryFiles(p) {
    var directories = [p];
    var files = [];
    var dir_index = 0;
    while (directories.length > dir_index) {
        var dir = directories[dir_index]
        var results = fs.readdirSync(dir);
        results = results.reduce(function(prev, cur) {
            var abspath = dir + "/" + cur;
            var stats = fs.lstatSync(abspath);
            if (stats.isSymbolicLink()) {
                // Saves us from symlink infinite loops
                return;
            }
            if (stats.isFile()) {
                files.push(path.resolve(abspath));
            }
            if (stats.isDirectory()) {
                directories.push(abspath);
            }
        });
        dir_index++;
    }
    return files;
}

LinkWatcher.prototype.apply = function(compiler) {
    var self = this;
    if (self.module) {
        // Watched files will show up using this format
        const module_path = './node_modules/' + self.module;
        let module_src = module_path;
        if (self.watchDirectory !== undefined) {
            module_src += '/' + self.watchDirectory;
        }
        // Output files need to be based on real home
        let output_path = self.module_path;
        if (self.outputDirectory !== undefined) {
            output_path += "/" + self.outputDirectory;
        }

        const watchedFiles = directoryFiles(module_src);
        const outputFiles = directoryFiles(output_path);

        var cb = function(cb) {
            const action = exec(self.action + " " + self.args.join(" "), {}, (error, stdout, stderr) => {
                // Show the build output
                console.log(stdout);
                console.log(stderr);
                exec("./node_modules/.bin/webpack", (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                });
                cb();
            });
        }

        compiler.watchFileSystem = new LinkWatchingFileSystem(compiler.watchFileSystem, watchedFiles, outputFiles, cb);
    }
}

module.exports = LinkWatcher;

class LinkWatchingFileSystem {
    constructor(wfs, rebuildFiles, builtFiles, callback) {
        this.wfs = wfs;
        this.rebuild = rebuildFiles;
        this.built = builtFiles;
        this.callback = callback;
    }

    watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
        var watch_files = files.concat(this.rebuild, this.built);
        var link_files = this.rebuild;
        var built_files = this.built;
        var link_cb = this.callback;
        var sentinel = this.sentinel;
        this.wfs.watch(watch_files, dirs, missing, startTime, options, (err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) => {
            if(err) return callback(err);

            // Filter filesModified; if any are from link_files, we need to trigger link_cb
            var modified = filesModified.reduce(function(prev, cur) {
                if (link_files.indexOf(cur) !== -1) {
                    prev.link.push(cur);
                } else {
                    prev.rest.push(cur);
                }
                return prev;
            }, {link: [], rest: []});
            let cb = callback.bind(this, err, modified.rest, dirsModified, missingModified, fileTimestamps, dirTimestamps);
            if (modified.link.length) {
                link_cb(cb);
            } else {
                cb();
            }
        }, callbackUndelayed);
    }
}