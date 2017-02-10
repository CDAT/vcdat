/* global __dirname */
// Plugin that monitors symlinked node_modules dependencies for changes, and reinstalls them if changes are made
var LinkWatcher = require("./LinkWatcher.js");

module.exports = {
    entry: "./src/js/App.js",
    devtool: 'source-map',
    output: {
        path: __dirname + "/dist",
        filename: "Bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        // Will watch the module for updates, if it's symlinked.
        new LinkWatcher({
            module: 'vcs-widgets', // Installed module to track
            watchDirectory: 'src',  // Directory to watch for changes
            npmCommand: "preinstall",
            outputDirectory: 'built'
        }),
    ]
};
