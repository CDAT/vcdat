import React from 'react';
import Tree from '../Tree.jsx';
/* global $ */

function treeifyFiles(f) {
    return {
        'title': f.name,
        'contents': Object.keys(f.subItems).map((s) => { return treeifyFiles(f.subItems[s]); })
    };
}

function navigatePath(f, p) {
    const next_f = Object.keys(f.subItems).reduce((prev, cur) => {
        if (prev !== null) {
            return prev;
        }
        if (cur === p[0]) {
            return f.subItems[cur];
        }
        return null;
    }, null);
    if (p.length == 1) {
        return next_f;
    } else {
        return navigatePath(next_f, p.slice(1));
    }
}

var FileExplorer = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func
    },
    getInitialState() {
        return {
            files: {
                subItems: {}
            },
            file_selected: false
        };
    },
    componentDidMount() {
        $('#file-explorer').on('shown.bs.modal', () => {
            $.get('getInitialFileTree').then((obj) => {
                this.setState({files: obj});
            });
        });
    },
    cacheFile() {
        const selectedFile = navigatePath(this.state.files, this.state.file_selected);
        const path_error = selectedFile.path + selectedFile.name;
        const path = path_error.replace("//", "/");

        $.get('/loadVariablesFromFile', {'path': path}).then((obj) => {
            this.props.addFileToCache(selectedFile.name, path, obj.variables);
            $('#file-explorer').modal('hide');
        })
    },
    activatePath(path) {
        const f = navigatePath(this.state.files, path);
        if (f.directory) {
            // Check if we've already loaded this path.
            if (Object.keys(f.subItems).length === 0) {
                // Load it (if it's a zero length file we'll wind up reloading, but that's fine.)
                $.get("/browseFiles", {'path': f.path + "/" + f.name}).then((obj) => {
                    const newFiles = $.extend(true, {}, this.state.files);
                    let parent = newFiles;
                    if (path.length > 1) {
                        parent = navigatePath(newFiles, path.slice(0, -1));
                    }
                    parent.subItems[obj.name] = obj;
                    this.setState({'files': newFiles});
                });
            }
        } else {
            this.setState({"file_selected": path});
        }
    },
    render() {
        const files = Object.keys(this.state.files.subItems).map((k) => {return treeifyFiles(this.state.files.subItems[k]);});

        return (
            <div className="modal fade" id='file-explorer' data-backdrop='static' data-keyboard='false'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">File Explorer</h4>
                        </div>
                        <div className="modal-body">
                            <Tree contents={files} activate={(path) => {this.activatePath(path);}}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={(e) => {this.cacheFile()}}
                                disabled={!this.state.file_selected}>
                                Open
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default FileExplorer;
