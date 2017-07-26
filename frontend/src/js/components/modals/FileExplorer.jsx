import React, { Component } from 'react';
import _ from 'lodash';
import Tree from '../Tree.jsx';
import { Modal, ButtonToolbar, Button, Row, Col, Glyphicon } from 'react-bootstrap';
import style from './FileExplorer.css';
/* global $ */

function cleanPath(path) {
    return `/${path.split('/').filter(segment => segment).join('/')}/`;
}

const SortDirection = {
    ascending: true,
    descending: false
}

const SortByType = {
    name: true,
    modifiedTime: false
}

class FileExplorer extends Component {
    constructor(props) {
        super(props);
        this.tryClose = this.tryClose.bind(this);
        this.state = {
            files: [],
            pathSegments: [],
            selectedFile: null,
            sortDirection: SortDirection.ascending,
            sortBy: SortByType.name
        };
        this.directories = new Map();
    }

    componentDidMount() {
        $.get('getInitialFileTree').then((files) => {
            this.process(files);
            this.directories.set(files.path, files);
        });
    }

    getDirectory(path) {
        if (this.directories.has(path)) {
            return Promise.resolve(this.directories.get(path));
        }
        return Promise.resolve($.get("/browseFiles", { 'path': path }))
            .then(files => {
                path = files.path;
                this.directories.set(cleanPath(path), files);
                return files;
            })
    }

    handleFileClick(file) {
        if (file.directory) {
            this.getDirectory(cleanPath(`${file.path}/${file.name}`))
                .then(files => {
                    this.process(files);
                })
        }
        else {
            this.setState({ selectedFile: this.state.selectedFile === file ? null : file });
        }
    }

    handleBackClick() {
        var pathSegments = this.state.pathSegments.slice();
        pathSegments.pop();
        this.setState({ pathSegments: pathSegments });
        this.getDirectory('/' + pathSegments.join('/') + '/')
            .then(files => {
                this.process(files);
            })
    }

    handlePathSegmentClick(pathSegment) {
        var pathSegments = this.state.pathSegments.slice();
        pathSegments.splice(this.state.pathSegments.indexOf(pathSegment) + 1);
        this.setState({ pathSegments: pathSegments });
        this.getDirectory('/' + pathSegments.join('/') + '/')
            .then(files => {
                this.process(files);
            })
    }

    tryClose() {
        this.props.onTryClose();
    }

    process(files) {
        const pathSegments = files.path.split('/').filter(path => path);
        this.setState({
            pathSegments: pathSegments,
            files: Object.values(files.subItems)
        });
        this._$fileList.scrollTop(0);
    }

    render() {
        var files = _.sortBy(this.state.files, (file) => {
            if (this.state.sortBy == SortByType.name) {
                return file.name;
            }
            else {
                return new Date(file.modifiedTime);
            }
        });
        if (this.state.sortDirection == SortDirection.descending) {
            files = files.reverse();
        }

        return (
            <Modal show={this.props.show} onHide={this.tryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Explorer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="navigation-bar">
                        <Col xs={1}><Glyphicon className="back-button" glyph="chevron-left" onClick={() => this.handleBackClick()} /></Col>
                        <Col className="path" xs={9}>
                            {
                                this.state.pathSegments.map((path, i) => {
                                    return <a className="path-segment" key={i} onClick={() => this.handlePathSegmentClick(path)}>/{path}</a>
                                })
                            }
                        </Col>
                        <Col className="sort" xs={2}>
                            <Glyphicon className="sort-item sort-direction" glyph={this.state.sortDirection === SortDirection.ascending ? "sort-by-attributes" : "sort-by-attributes-alt"} onClick={() => this.setState({ sortDirection: !this.state.sortDirection })} />
                            <Glyphicon className="sort-item sort-by" glyph={this.state.sortBy === SortByType.name ? "font" : "time"} onClick={() => this.setState({ sortBy: !this.state.sortBy })} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={11} xsOffset={1}>
                            {this.state.files.length !== 0 &&
                                <ol className="file-list" ref={(el) => { this._$fileList = $(el); }} >
                                    {
                                        files.map((file) => {
                                            return <li key={file.path + '\\' + file.name} onClick={() => this.handleFileClick(file)} className={(this.state.selectedFile && this.state.selectedFile.path + this.state.selectedFile.name == file.path + file.name) ? 'selected' : ''}><a>
                                                <Glyphicon className="file-icon" glyph={file.directory ? 'folder-open' : 'file'} />
                                                <span>{file.name}</span></a>
                                            </li>
                                        })
                                    }
                                </ol>}
                            {this.state.files.length === 0 &&
                                <span>Empty</span>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.tryClose}>Cancel</Button>
                    <Button onClick={(e) => { this.props.onFileSelected(this.state.selectedFile) }} disabled={!this.state.selectedFile}>Select</Button>
                </Modal.Footer>
            </Modal>
        )
    }
};

FileExplorer.propTypes = {
    show: React.PropTypes.bool,
    addFileToCache: React.PropTypes.func,
    onTryClose: React.PropTypes.func,
    onFileSelected: React.PropTypes.func
}

export default FileExplorer;
