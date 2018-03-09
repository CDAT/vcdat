import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Modal, Button, Dropdown, MenuItem } from 'react-bootstrap';
import _ from 'lodash'
import Actions from '../../../constants/Actions.js'
import ColorPicker from './ColorPicker.jsx'
import ColormapWidget from './ColormapWidget.jsx'
import NewColormapModal from './NewColormapModal.jsx'
var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333"),
            showImportExportModal: false,
            selectedColormapName: "viridis",
            select_val: "viridis",
            show_new_colormap_modal: false,
        }
    }

    static get propTypes() {
        return {
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
            selected_cell_col: React.PropTypes.number,
            selected_cell_row: React.PropTypes.number,
            colormaps: React.PropTypes.object,
            defaultColormap: React.PropTypes.string,
            deleteColormap: React.PropTypes.func,
        }; 
    }

    handleChange(color) {
        this.setState({ currentColor: color })
    }

    closeImportExportModal(){
        this.setState({showImportExportModal: false})
    }

    openImportExportModal(){
        this.setState({showImportExportModal: true})
    }

    handleApply(row, col){
        this.refs.widget.getWrappedInstance().applyColormap(row, col)
    }

    handleSelectColormap(name){
        this.setState({select_val: name})
    }

    handleLoadColormap(){
        this.setState({selectedColormapName: this.state.select_val})
        this.refs.widget.getWrappedInstance().handleColormapSelect(this.state.select_val)
    }

    handleOpenNewColormapModal(){
        this.setState({
            show_new_colormap_modal: true
        })
    }

    handleDeleteColormap(){
        // TODO: If i use a colormap then delete it what happens?
        let nameToDelete = this.state.select_val
        if(nameToDelete !== "default"){
            if(confirm(`Are you sure you want to delete '${nameToDelete}'?`)) {
                try{
                    if(vcs){ // eslint-disable-line no-undef
                        vcs.removecolormap(nameToDelete).catch((e) => {throw e}) // eslint-disable-line no-undef
                    }
                }
                catch(e){
                    if(e instanceof ReferenceError){
                        console.warn("VCS is not defined. Is the VCS Server running?")
                        toast.error("VCS is not loaded. Try restarting vCDAT", { position: toast.POSITION.BOTTOM_CENTER })
                        return
                    }
                    else{
                        console.warn(e)
                        toast.error("Failed to delete colormap", { position: toast.POSITION.BOTTOM_CENTER })
                        return
                    }
                }
                let colormapNames = Object.keys(this.props.colormaps).sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase())
                })
                let index = colormapNames.indexOf(nameToDelete)
                if(index == colormapNames.length - 1){ // if the colormap to delete is the last in the list
                    index = colormapNames.length - 2; // select the colormap before it
                }
                else{
                    index++ // else, select the colormap below it
                }
                let name = colormapNames[index]
                let currentColormap = _.map(this.props.colormaps[name], _.clone())
                this.props.deleteColormap(nameToDelete)
                toast.success("Colormap deleted successfully", { position: toast.POSITION.BOTTOM_CENTER })
                setTimeout(()=>{
                    this.setState({
                        select_val: name,
                        selectedColormapName: name,
                        currentColormap: currentColormap,
                    })
                    this.refs.widget.getWrappedInstance().handleColormapSelect(name)
                }, 0)
            } 
            else{
                return
            }
        }
        else{
            toast.warn("The default colormap cannot be deleted", { position: toast.POSITION.BOTTOM_CENTER })
        }
    }

    createNewColormap(name){
        if(Object.keys(this.props.colormaps).indexOf(name) >= 0){
            toast.warn("A colormap with that name already exists. Please select a different name", {position: toast.POSITION.BOTTOM_CENTER})
        }
        else{
            this.refs.widget.getWrappedInstance().createNewColormap(this.state.select_val, name).then((result)=>{
                if(result){
                    this.refs.widget.getWrappedInstance().handleColormapSelect(name)
                    this.setState({
                        selectedColormapName: name,
                        show_new_colormap_modal: false,
                    })
                    toast.success("Colormap created successfully", {position: toast.POSITION.BOTTOM_CENTER})
                }
            })
        }
    }

    handleApplyColormap(){
        this.refs.widget.getWrappedInstance().applyColormap(this.state.selectedColormapName, this.props.selected_cell_row, this.props.selected_cell_col)
    }

    render(){
        const apply_disabled = this.props.selected_cell_row === -1 || this.props.selected_cell_col === -1
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editing Colormap: {this.state.selectedColormapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-inline " style={{display: "flex", justifyContent: "center"}}>
                            <div className="form-group">
                                <label htmlFor="cm-select" className="control-label">Colormaps</label>
                                <select
                                    name="cm-select"
                                    className="form-control"
                                    style={{marginLeft: "5px", marginRight: "5px"}}
                                    onChange={(event) => {this.handleSelectColormap(event.target.value)}}
                                    value={this.state.select_val}>
                                    { this.props.colormaps ? (
                                        Object.keys(this.props.colormaps).sort(function (a, b) {
                                            return a.toLowerCase().localeCompare(b.toLowerCase());
                                        }).map( name => ( <option key={name} value={name}>{name}</option> ))
                                        ) : (
                                        <option value="" disabled />
                                    )}
                                </select>
                            </div>
                            <div>
                                <button 
                                    title="Load the selected colormap for editing"
                                    onClick={() => {this.handleLoadColormap()}}
                                    className="btn btn-default btn-sm"
                                    style={{marginLeft: "5px"}}>
                                        Load
                                </button>
                                <button 
                                    title="Create a new copy of the selected colormap"
                                    onClick={() => {this.handleOpenNewColormapModal()}}
                                    className="btn btn-primary btn-sm"
                                    style={{marginLeft: "5px"}}>
                                        New
                                </button>
                                <button
                                    title="Delete Selected Colormap"
                                    onClick={() => {this.handleDeleteColormap()}}
                                    className="btn btn-danger btn-sm"
                                    style={{marginLeft: "5px"}}>
                                        <i className="glyphicon glyphicon-trash"></i>
                                </button>
                            </div>
                        </div>
                        <hr/>
                        <ColorPicker 
                            color={this.state.currentColor}
                            onChange={(color) => {this.handleChange(color)}}/>
                        <ColormapWidget 
                            ref="widget"
                            color={this.state.currentColor} 
                            onChange={(color) => {this.handleChange(color)}}
                            showImportExportModal={this.state.showImportExportModal}
                            closeImportExportModal={this.closeImportExportModal.bind(this)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().blendColors()}}>
                            Blend
                        </Button>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().resetColormap()}}>
                            Reset
                        </Button>
                        <Button
                            style={{float: "left"}}
                            disabled={apply_disabled}
                            title={apply_disabled ? "A cell must be selected to apply a colormap" : "Apply the colormap shown to the currently selected cell"}
                            onClick={() => {this.handleApplyColormap()}}>
                            Apply</Button>
                        <Button onClick={() => {this.refs.widget.getWrappedInstance().saveColormap(this.state.selectedColormapName)}}>Save</Button>
                        <Button onClick={this.openImportExportModal.bind(this)}>Import/Export</Button>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <NewColormapModal 
                    show={this.state.show_new_colormap_modal}
                    close={() => this.setState({show_new_colormap_modal: false})}
                    newColormap={(name) => this.createNewColormap(name)} />
            </div>
        )
    }
}

ColormapEditor.defaultProps = {
    defaultColormap: 'viridis'
}

const mapStateToProps = (state) => {
    let cell_id_string = state.present.sheets_model.selected_cell_id // format of `sheet_row_col`. Ex: "0_0_0"
    let sheet_row_col = cell_id_string.split("_").map(function (str_val) { return Number(str_val) })
    let row = sheet_row_col[1]
    let col = sheet_row_col[2]
    return {
        selected_cell_row: row,
        selected_cell_col: col,
        colormaps: state.present.colormaps,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteColormap: (name) => {
            dispatch(Actions.deleteColormap(name));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColormapEditor);
export {ColormapEditor as PureColormapEditor}