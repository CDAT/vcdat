import React, { Component } from 'react';
import { Modal, ButtonToolbar, Button, Row, Col, Glyphicon, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import Dialog from 'react-bootstrap-dialog';
import DoubleSlider from 'components/DoubleSlider/DoubleSlider.jsx';

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

    componentWillUpdate(nextProps, nextState) {
        console.log(nextProps, nextState);
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
            });
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

        vcs.variables(path).then((variablesAxes) => {
            console.log(variablesAxes);
            this.setState({ selectedFile: file, variablesAxes });
        });
    }

    render() {
        // var variables = _.flatten(_.values(this.props.cachedFiles).map(file => file.variables));

        return (
            <Modal id='cached-files' bsSize="large" show={this.props.show} onHide={this.tryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Load Variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Row>
                            <Col className="text-right" sm={2}>
                                <h4>Load From</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" sm={2}>
                                File:
                            </Col>
                            <Col sm={10}>
                                <InputGroup bsSize="small">
                                    <FormControl className="full-width file-path" type="text" value={this.selectedFilePath} />
                                    <InputGroup.Button>
                                        <Button bsStyle="primary" onClick={
                                            () => this.setState({ showFileExplorer: true })}><Glyphicon glyph="file" /></Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" sm={2}>
                                Variable(s):
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    className="input-sm full-width"
                                    componentClass="select"
                                    onChange={(e) => this.setState({ selectedVariable: e.target.value })}
                                    value={this.state.selectedVariable}>
                                    {this._formatvariablesAxes()}
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" sm={2}>
                                History:
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass="textarea" />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" sm={2}>
                                Bookmarks(s):
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass="textarea" />
                            </Col>
                        </Row>
                    </div>
                    {this.state.selectedVariable &&
                        <div>
                            <Row>
                                <Col className="text-right" sm={2}>
                                    <h4>Dimensions</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <DoubleSlider value1={0} value2={12} min={0} max={20} step={1} onChange={()=>console.log('123')} />
                                </Col>
                            </Row>
                        </div>
                    }
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

    _formatvariablesAxes() {
        return this.state.variablesAxes && [
            <optgroup key="variables" label="------">{this._formatVariables(this.state.variablesAxes[0])}</optgroup>,
            <optgroup key="axes" label="------">{this._formatAxes(this.state.variablesAxes[1])}</optgroup>
        ]
    }

    _formatVariables(variables) {
        return Object.keys(variables).map((variableName) => {
            // let variable = variables[variableName];
            // let label = `${variableName} (${variable.shape.join(',')}) ${variable.name}`
            var vars = variables;
            var v = variableName;
            var shape = '(' + vars[v].shape[0];
            for (let i = 1; i < vars[v].shape.length; ++i) {
                shape += (',' + vars[v].shape[i]);
            }
            shape += ')';
            // axes for the variable
            var al = vars[v].axisList;
            var axisList = '(' + al[0];
            for (let i = 1; i < al.length; ++i) {
                axisList += (', ' + al[i]);
            }
            axisList += ')';
            // bounds are received for longitude and latitude
            var boundsString = '';
            if (vars[v].bounds) {
                boundsString += ': (' + vars[v].bounds[0] + ', ' +
                    vars[v].bounds[1] + ')';
            }
            // longitude, latitude for the variable
            // these are different than the axes for the curvilinear or
            // generic grids
            var lonLat = null;
            if (vars[v].lonLat) {
                lonLat = '(' + vars[v].lonLat[0] + ', ' +
                    vars[v].lonLat[1] + ')';
            }
            var label = v + shape + '[' + vars[v].name + ', ' +
                vars[v].units + boundsString + ']' + ': ' + axisList;
            if (lonLat) {
                label += (', ' + lonLat);
            }
            if (vars[v].gridType) {
                label += (', ' + vars[v].gridType);
            }

            return <option key={variableName}>{label}</option>;
        })
    }

    _formatAxes(axes) {
        return Object.keys(axes).map((axisName) => {
            var v = axisName;
            var shape = '(' + axes[v].shape[0];
            for (let i = 1; i < axes[v].shape.length; ++i) {
                shape += (',' + axes[v].shape[i]);
            }
            shape += ')';
            var label = v + shape + '[' + axes[v].name + ', ' +
                axes[v].units + ': (' +
                axes[v].data[0] + ', ' +
                axes[v].data[axes[v].data.length - 1] + ')]';
            return <option key={axisName}>{label}</option>;
        });
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
