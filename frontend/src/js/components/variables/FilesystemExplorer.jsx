import React from 'react';
import Tree from '../Tree.jsx';

function treeFiles(file) {
    let title = file.name;
    if (file.variable) {
        return {title: file.label, contents: []};
    }
    if (title === undefined) {
        return {title: file, contents: []};
    }
    let contents = file.sub_items.map(treeFiles);
    return {title, contents};
}


function fileByPath(f, path) {
    return path.reduce((curfile, pathSelector) => {
        return curfile.sub_items.reduce((target, file) => {
            if (file.label === pathSelector || file.name === pathSelector || file === pathSelector) {
                return file;
            }
            return target;
        }, null)
    }, f);
}


var FilesystemExplorer = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func
    },
    getInitialState() {
        return {
            files: {
                sub_items: [],
                name: '',
                path: '',
            },
            treeReady: []
        };
    },
    componentWillMount() {
        $.get('browseFiles').then((obj) => {
            this.setState({files: obj, treeReady: treeFiles(obj)});
        });
    },
    selectFile(path) {
        // The first path item just points at the root file
        const path_sel = path.slice(1);
        const target_file = fileByPath(this.state.files, path_sel);
        if (target_file.variable) {
            console.log(target_file);
        } else if (!target_file.sub_items.length) {
            if (target_file.variable) {
                this.props.loadedVariable(target_file.variable);
            } else {
                // Retrieve variable info, append to the state
                console.log("Retrieving variable info for", target_file.path);
                $.get("/loadVariablesFromFile", {"path": target_file.path}).then((result) => {
                    const vars = result.variables
                    const new_files = $.extend(true, {}, this.state.files);
                    const new_f = $.extend(true, {}, target_file);
                    new_f.sub_items = vars.map((v) => {
                        v.variable = true;
                        return v;
                    });
                    // Retrieve the containing element
                    const parent_f = fileByPath(new_files, path_sel.slice(0, -1));
                    // Now find the index of new_f and replace it
                    const ind = parent_f.sub_items.reduce((p, cur, ind) => {
                        if (cur.name == new_f.name) {
                            return ind;
                        }
                        return p;
                    }, null);
                    parent_f.sub_items[ind] = new_f;
                    this.setState({"files": new_files, "treeReady": treeFiles(new_files)});
                });
            }
        }
    },
    render() {
        return (
            <Tree contents={[this.state.treeReady]} activate={(path) => this.selectFile(path)} />
        )
    }
})

export default FilesystemExplorer;
