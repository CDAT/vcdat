import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, InputGroup, FormControl, Button, Row, Col, Glyphicon } from 'react-bootstrap';
import style from './FileExplorer.scss';

var minimatch = require("minimatch")
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
            files: null,
            pathSegments: [],
            selectedFile: null,
            sortDirection: SortDirection.ascending,
            sortBy: SortByType.name,
            filter: "",
        };
        this.directories = new Map();
    }

    componentDidMount() {
        if(this.props.recent_path){
            let files = this.getDirectory(this.props.recent_path)
            files.then((files) =>{
                this.process(files)
                this.directories.set(files.path, files);
            })
        }
        else{
            this.goHome()
        }
    }

    goHome(){
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

    handleFilterChange(event){
        this.setState({filter: event.target.value})
    }

    render() {
        var files = _.sortBy(this.state.files, (file) => {
            if (this.state.sortBy == SortByType.name) {
                return file.name.toLowerCase();
            }
            else {
                return new Date(file.modifiedTime);
            }
        });
        if (this.state.sortDirection == SortDirection.descending) {
            files = files.reverse();
        }
        let folder_list = []
        let file_list = []
        for(let item of files){
            if(item.directory === true){
                folder_list.push(item)
            }
            else{
                file_list.push(item)
            }
        }
        files = folder_list.concat(file_list)
        if(this.state.filter){
            files = files.filter((file) => {return minimatch(file.name, this.state.filter)})
        }
        return (
            <Modal show={this.props.show} onHide={this.tryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>File Explorer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="navigation-bar">
                        <Button className="path-back-button" onClick={() => this.handleBackClick()}disabled={this.state.pathSegments.length === 0}>
                            <Glyphicon className="button back" glyph="chevron-left" />
                        </Button>
                        <div className="breadcrumbs">
                        {
                            this.state.pathSegments.length === 0 ? // if the path segments array is empty we are at /
                                <span className="active">
                                    <a>/</a>
                                </span> 
                            :
                                this.state.pathSegments.map((path, i) => { // else, we have some path to display
                                    return (
                                        <span key={i} className={ i === this.state.pathSegments.length-1 ? "active" : ""} >
                                            {
                                                i === 0 ? null : <span className="breadcrumb-separator">/</span> 
                                            }
                                            <a className="path-segment" onClick={() => this.handlePathSegmentClick(path)}>{path}</a>
                                        </span>
                                    )
                                })
                        }
                        </div>
                    </div>
                    <Row>
                        <Col className="filter" xs={12}>
                            <InputGroup>
                                <InputGroup.Addon>Filter</InputGroup.Addon>
                                <FormControl
                                    type="text"
                                    placeholder="*.nc"
                                    onChange={(e) => {this.handleFilterChange(e)}}
                                    value={this.state.filter}
                                />
                                <div className="input-group-btn">
                                    <Button>
                                        <Glyphicon 
                                            className="button sort-item sort-direction"
                                            glyph={this.state.sortDirection === SortDirection.ascending ? "sort-by-attributes" : "sort-by-attributes-alt"}
                                            onClick={() => this.setState({ sortDirection: !this.state.sortDirection })} />
                                    </Button>
                                    <Button>
                                        <Glyphicon
                                            className="button sort-item sort-by"
                                            glyph={this.state.sortBy === SortByType.name ? "font" : "time"}
                                            onClick={() => this.setState({ sortBy: !this.state.sortBy })} />
                                    </Button>
                                </div>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            {this.state.files && this.state.files.length !== 0 &&
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
                            {this.state.files && this.state.files.length === 0 &&
                                <span>Empty</span>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.tryClose}>Cancel</Button>
                    <Button bsStyle="primary" onClick={(e) => { this.props.onFileSelected(this.state.selectedFile) }} disabled={!this.state.selectedFile}>Select</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

FileExplorer.propTypes = {
    show: React.PropTypes.bool,
    onTryClose: React.PropTypes.func,
    onFileSelected: React.PropTypes.func,
    recent_path: React.PropTypes.string,
}

export default FileExplorer;
