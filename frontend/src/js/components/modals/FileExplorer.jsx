import React, { Component } from 'react';
import Tree from '../Tree.jsx';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
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



class FileExplorer extends Component {
    constructor(props) {
        super(props);
        this.tryClose = this.tryClose.bind(this);
        this.state = {
            files: {
                subItems: {}
            },
            file_selected: false
        };
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.show) {
            $.get('getInitialFileTree').then((obj) => {
                this.setState({ files: obj });
            });
        }
    }
    cacheFile() {
        const selectedFile = navigatePath(this.state.files, this.state.file_selected);
        const path = selectedFile.path + "/" + selectedFile.name;
        $.get('/loadVariablesFromFile', { 'path': path }).then((obj) => {
            this.props.addFileToCache(selectedFile.name, path, obj.variables);
            $('#file-explorer').modal('hide');
        }).catch((error) => {
            alert("Unable to open selected file.");
        });
    }
    activatePath(path) {
        const f = navigatePath(this.state.files, path);
        if (f.directory) {
            // Check if we've already loaded this path.
            if (Object.keys(f.subItems).length === 0) {
                // Load it (if it's a zero length file we'll wind up reloading, but that's fine.)
                $.get("/browseFiles", { 'path': f.path + "/" + f.name }).then((obj) => {
                    const newFiles = $.extend(true, {}, this.state.files);
                    let parent = newFiles;
                    if (path.length > 1) {
                        parent = navigatePath(newFiles, path.slice(0, -1));
                    }
                    parent.subItems[obj.name] = obj;
                    this.setState({ 'files': newFiles });
                });
            }
        } else {
            this.setState({ "file_selected": path });
        }
    }
    tryClose() {
        this.props.onTryClose();
    }
    render() {
        const files = Object.keys(this.state.files.subItems).map((k) => { return treeifyFiles(this.state.files.subItems[k]); });

        return (
            <Modal show={this.props.show} onHide={this.tryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Explorer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tree contents={files} activate={(path) => { this.activatePath(path); }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.tryClose}>Cancel</Button>
                    <Button onClick={(e) => { this.cacheFile() }} disabled={!this.state.file_selected}>Save</Button>
                </Modal.Footer>
            </Modal>
        )
    }
};

FileExplorer.propTypes = {
    addFileToCache: React.PropTypes.func
}

export default FileExplorer;
