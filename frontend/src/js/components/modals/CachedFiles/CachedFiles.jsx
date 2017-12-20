import React, { Component } from 'react';
import { Modal, Button} from 'react-bootstrap';
import _ from 'lodash';
import Dialog from 'react-bootstrap-dialog';
import { connect } from 'react-redux';
import './CachedFiles.scss';
import FileTab from 'Tabs/FileTab.jsx'
// import Esgf from 'Tabs/EsgfTab.jsx'
// import OpendapTab from 'Tabs/OpendapTab.jsx'
// import EditTab from 'Tabs/EditTab.jsx'
// import InfoTab from 'Tabs/InfoTab.jsx'


class CachedFiles extends Component {
    constructor(props) {
        super(props);
        
        let selectedTab;
        if(this.props.editMode){
            selectedTab = 'edit';
        }
        else{
            selectedTab = 'file';
        }
        
        this.state = {
            showRedefineVariableModal: false,
            selectedTab: selectedTab,
        }
    }

    get selectedFilePath() {
        return !this.state.selectedFile ? '' : cleanPath(this.state.selectedFile.path + '/' + this.state.selectedFile.name);
    }

    get variableName() {
        if (this.state.redefinedVariableName) {
            return this.state.redefinedVariableName;
        }
        return !this.state.selectedVariableName ? '' : this.state.selectedVariableName;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedVariableName !== prevState.selectedVariableName || (this.state.selectedVariableName && !this.state.selectedVariable)) {
            let selectedVariable, dimension;
            if (this.state.variablesAxes[0][this.state.selectedVariableName]) {
                // it's a variablevar 
                selectedVariable = this.state.variablesAxes[0][this.state.selectedVariableName];
                dimension = selectedVariable.axisList.map((axisName) => {
                    return { axisName };
                })
            }
            else {
                // it's a axis
                selectedVariable = this.state.variablesAxes[1][this.state.selectedVariableName];
                dimension = { axisName: this.state.selectedVariableName };
            }
            this.setState({
                selectedVariable,
                dimension
            });
        }
    }

    loadVariable() {
        let variable = this.state.selectedVariableName;
        let filename = this.state.selectedFile;
        let path = this.selectedFilePath;

        let var_obj = {};
        var_obj[this.variableName] = {
            cdms_var_name: variable,
            axisList: this.state.selectedVariable.axisList,
            filename: filename,
            path: path,
            dimension: this.state.dimension
        };
        this.props.loadVariables([var_obj]);
        this.setState({ redefinedVariableName: '' });
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

    render() {
        return (
            <Modal className='cached-files' bsSize="large" show={this.props.show} onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Load Variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center variable-tabs">
                        <Button bsSize="small" bsStyle={this.state.selectedTab == "file" ? 'primary' : 'default'} onClick={()=>{this.setState({selectedTab: 'file'})}}>File</Button>
                        <Button bsSize="small" bsStyle={this.state.selectedTab == "esfg" ? 'primary' : 'default'} onClick={()=>{this.setState({selectedTab: 'esfg'})}}>ESGF</Button>
                        <Button bsSize="small" bsStyle={this.state.selectedTab == "opendap" ? 'primary' : 'default'} onClick={()=>{this.setState({selectedTab: 'opendap'})}}>OpenDAP</Button>
                        <Button bsSize="small" bsStyle={this.state.selectedTab == "edit" ? 'primary' : 'default'} onClick={()=>{this.setState({selectedTab: 'edit'})}}>Edit</Button>
                        <Button bsSize="small" bsStyle={this.state.selectedTab == "info" ? 'primary' : 'default'} onClick={()=>{this.setState({selectedTab: 'info'})}}>Info</Button>
                    </div>
                    {
                        this.state.selectedTab == 'esgf' ? <div className="Dummy-esgf-component">ESGF</div> :
                        this.state.selectedTab == 'opendap' ? <div className="Dummy-opendap-component">OpenDAP</div> :
                        this.state.selectedTab == 'edit' ? <div className="Dummy-edit-component">Edit</div> :
                        this.state.selectedTab == 'edit' ? <div className="Dummy-edit-component">Info</div> : <FileTab></FileTab>
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

const mapStateToProps = (state, ownProps) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CachedFiles)

export function cleanPath(path) {
    return `/${path.split('/').filter(segment => segment).join('/')}`;
}