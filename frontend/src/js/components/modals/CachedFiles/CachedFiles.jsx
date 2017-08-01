import React, { Component } from 'react';
import { Modal, ButtonToolbar, Button, Row, Col, Glyphicon, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import Dialog from 'react-bootstrap-dialog';

import FileExplorer from '../FileExplorer/FileExplorer.jsx';
import './CachedFiles.css';

function cleanPath(path) {
    return `/${path.split('/').filter(segment => segment).join('/')}`;
}

class CachedFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFileExplorer: false,
            showRedefineVariableModal: false,
            selectedFile: '',
            selectedVariable: '',
            redefinedVariableName: '',
            temporaryRedefinedVariableName: ''
        }
    }

    get selectedFilePath() {
        return !this.state.selectedFile ? '' : cleanPath(this.state.selectedFile.path + '/' + this.state.selectedFile.name);
    }

    get variableName() {
        if (this.state.redefinedVariableName) {
            return this.state.redefinedVariableName;
        }
        return !this.state.selectedVariable ? '' : this.state.selectedVariable.split(' (')[0];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cachedFiles != this.props.cachedFiles) {
            var something = _.flatten(_.values(nextProps.cachedFiles).map(file => file.variables))[0];
            this.setState({ selectedVariable: _.flatten(_.values(nextProps.cachedFiles).map(file => file.variables))[0] });
        }
    }

    getProvenance(path, var_name) {
        return Promise.resolve($.get('getVariableProvenance', { 'path': path, 'varname': var_name }))
    }

    loadVariable() {
        let variable = this.state.selectedVariable.split(' (')[0];
        let filename = this.state.selectedFile;
        let path = this.selectedFilePath;

        let var_obj = {};
        let var_provenance = {};
        return this.getProvenance(path, variable)
            .then((result) => {
                let obj = result;
                var_provenance = obj;
                var_obj[this.variableName] = {
                    cdms_var_name: variable,
                    filename: filename,
                    path: path,
                    provenance: var_provenance
                };
                this.props.loadVariables([var_obj])
            })
            .then(() => {
                this.setState({ redefinedVariableName: '' })
            })
    }

    load() {
        return this.variableNameExists()
            .then((result) => {
                if (result) {
                    return new Promise((resolve, reject) => {
                        this.refs.dialog.show({
                            title: 'Variable exists',
                            body: `The variable name ${this.variableName} already exists, rename or overwrite existing varaible`,
                            actions: [
                                Dialog.OKAction(() => resolve())
                            ]
                        })
                    })
                        .then(() => this.redefineVariableName());
                }
            })
            .then(() => {
                return this.loadVariable()
            })
    }

    loadAndClose() {
        this.load().then(() => this.props.onTryClose());
    }

    loadAs() {
        this.redefineVariableName()
            .then(() => {
                this.loadVariable();
            })
    }

    variableNameExists() {
        return Promise.resolve(this.variableName in this.props.curVariables);
    }

    redefineVariableName() {
        return new Promise((resolve, reject) => {
            this.doneRedefineVariable = () => { resolve() };
            this.setState({
                showRedefineVariableModal: true,
                temporaryRedefinedVariableName: this.variableName
            });
        })
    }

    handleFileExplorerTryClose() {
        this.setState({ showFileExplorer: false });
    }

    handleFileSelected(file) {
        this.handleFileExplorerTryClose();
        var path = cleanPath(file.path + '/' + file.name);
        return Promise.resolve($.get('/loadVariablesFromFile', { 'path': path }))
            .then((obj) => {
                this.setState({ selectedFile: file });
                this.props.addFileToCache(file.name, path, obj.variables);
            })
            .catch((error) => {
                alert("Unable to open selected file.");
            });
    }

    render() {
        var variables = _.flatten(_.values(this.props.cachedFiles).map(file => file.variables));

        return (
            <Modal id='cached-files' bsSize="large" show={this.props.show} onHide={this.tryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Load Variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h4>Load From</h4>
                        <Row>
                            <Col sm={2}>
                                File:
                            </Col>
                            <Col sm={10}>
                                <InputGroup className="input-group-sm">
                                    <FormControl className="full-width file-path" type="text" value={this.selectedFilePath} />
                                    <InputGroup.Button>
                                        <Button bsStyle="primary" onClick={
                                            () => this.setState({ showFileExplorer: true })}><Glyphicon glyph="file" /></Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                Variable(s):
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    className="input-sm full-width"
                                    componentClass="select"
                                    onChange={(e) => this.setState({ selectedVariable: e.target.value })}
                                    value={this.state.selectedVariable}>
                                    {
                                        variables.map((variable) => <option key={variable} value={variable}>{variable}</option>)
                                    }
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                History:
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass="textarea" />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                Bookmarks(s):
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass="textarea" />
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <h4>Dimensions</h4>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" bsSize="small" onClick={(e) => {
                        this.load()
                    }}>Load</Button>
                    <Button bsStyle="primary" bsSize="small" onClick={(e) => {
                        this.loadAndClose()
                    }}>Load and Close</Button>
                    <Button bsStyle="primary" bsSize="small" onClick={(e) => {
                        this.loadAs()
                    }}>Load As</Button>
                    <Button bsStyle="default" bsSize="small" onClick={() => this.props.onTryClose()}>Close</Button>
                </Modal.Footer>
                <Modal show={this.state.showRedefineVariableModal}>
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-sm">Rename variable</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>Variable name</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.temporaryRedefinedVariableName}
                                onChange={(e) => this.setState({ temporaryRedefinedVariableName: e.target.value })} />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" bsSize="small"
                            onClick={() => {
                                if (this.state.temporaryRedefinedVariableName) {
                                    this.doneRedefineVariable();
                                    this.setState({
                                        redefinedVariableName: this.state.temporaryRedefinedVariableName,
                                        showRedefineVariableModal: false
                                    });
                                }
                            }}>Confirm</Button>
                        <Button bsSize="small" onClick={() => this.setState({ showRedefineVariableModal: false })}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Dialog ref="dialog" />
                {this.state.showFileExplorer &&
                    <FileExplorer show={true} onTryClose={() => this.handleFileExplorerTryClose()} onFileSelected={(file) => this.handleFileSelected(file)} />}
            </Modal>
        )
    }
}
CachedFiles.propTypes = {
    show: React.PropTypes.bool.isRequired,
    onTryClose: React.PropTypes.func.isRequired,
    cachedFiles: React.PropTypes.object,
    curVariables: React.PropTypes.object.isRequired,
    loadVariables: React.PropTypes.func,
    addFileToCache: React.PropTypes.func,
}

export default CachedFiles;
