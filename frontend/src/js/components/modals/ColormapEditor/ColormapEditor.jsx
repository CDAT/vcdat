import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Modal, Button } from 'react-bootstrap'
import _ from 'lodash'
import Actions from '../../../constants/Actions.js'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../constants/PubSubEvents.js'
import ColorPicker from './ColorPicker.jsx'
import ColormapWidget from './ColormapWidget.jsx'
import NewColormapModal from './NewColormapModal.jsx'
import ImportExportModal from "./ImportExportModal.jsx"
var colorUtility = require('react-color/lib/helpers/color.js').default

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333"),
            show_import_export_modal: false,
            show_new_colormap_modal: false,
            selected_colormap_name: "viridis",
            selected_cells_start: -1,
            selected_cells_end: -1,
            current_colormap: this.props.colormaps[this.props.default_colormap].map(function(arr) {
                return arr.slice()
            }), // an array of arrays representing the current cells
        }
    }

    static get propTypes() {
        return {
            show: PropTypes.bool.isRequired, // show the modal
            close: PropTypes.func.isRequired, // close the modal
            selected_cell_col: PropTypes.number,
            selected_cell_row: PropTypes.number,
            colormaps: PropTypes.object,
            default_colormap: PropTypes.string,
            deleteColormap: PropTypes.func,
            saveColormap: PropTypes.func,
            sheet: PropTypes.object,
            updateGraphicsMethod: PropTypes.func,
            applyColormap: PropTypes.func,
            graphics_methods: PropTypes.object,
            startTour: PropTypes.func,
        };
    }

    handleChange(color) {
        if(this.state.current_colormap && this.state.selected_cells_start !== -1 && this.state.selected_cells_end !== -1){
            let updated_colormap = this.state.current_colormap.slice()
            updated_colormap[this.state.selected_cells_end][0] = Math.round((color.rgb.r / 255) * 100)
            updated_colormap[this.state.selected_cells_end][1] = Math.round((color.rgb.g / 255) * 100)
            updated_colormap[this.state.selected_cells_end][2] = Math.round((color.rgb.b / 255) * 100)
            this.setState({
                currentColor: color,
                current_colormap: updated_colormap
            })
        }
        else{
            this.setState({ currentColor: color })
        }
    }

    closeImportExportModal(){
        this.setState({show_import_export_modal: false})
    }

    openImportExportModal(){
        this.setState({show_import_export_modal: true})
    }

    handleSelectColormap(name){
        let current_colormap = _.map(this.props.colormaps[name], _.clone())
        this.setState({
            selected_colormap_name: name,
            current_colormap: current_colormap,
            selected_cells_start: -1,
            selected_cells_end: -1,
        })
    }

    handleOpenNewColormapModal(){
        this.setState({
            show_new_colormap_modal: true
        })
    }

    handleCellClick(start_cell, end_cell){
        this.setState({
            selected_cells_start: start_cell,
            selected_cells_end: end_cell,
        }, () => {
            const r = this.state.current_colormap[this.state.selected_cells_end][0] * 2.55
            const g = this.state.current_colormap[this.state.selected_cells_end][1] * 2.55
            const b = this.state.current_colormap[this.state.selected_cells_end][2] * 2.55
            this.handleChange(colorUtility.toState(`rgb(${r},${g},${b})`))
        })
    }

    handleDeleteColormap(){
        // TODO: If i use a colormap then delete it what happens?
        let nameToDelete = this.state.selected_colormap_name
        if(nameToDelete !== "default"){
            if(confirm(`Are you sure you want to delete '${nameToDelete}'?`)) {
                try{
                    if(vcs){
                        vcs.removecolormap(nameToDelete).catch((e) => {throw e})
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
                this.props.deleteColormap(nameToDelete)
                toast.success("Colormap deleted successfully", { position: toast.POSITION.BOTTOM_CENTER })
                let current_colormap = _.map(this.props.colormaps[name], _.clone())
                this.setState({
                    selected_colormap_name: name,
                    current_colormap: current_colormap,
                    selected_cells_start: -1,
                    selected_cells_end: -1,
                })
            }
            else{
                return
            }
        }
        else{
            toast.warn("The default colormap cannot be deleted", { position: toast.POSITION.BOTTOM_CENTER })
        }
    }

    createNewColormap(new_cm_name, colormap=this.state.selected_colormap_name){
        if(Object.keys(this.props.colormaps).indexOf(new_cm_name) >= 0){
            toast.warn("A colormap with that name already exists. Please select a different name", {position: toast.POSITION.BOTTOM_CENTER})
        }
        else{
            return this.createNewColormapInVcs(colormap, new_cm_name).then((result)=>{
                if(result){
                    this.handleSelectColormap(new_cm_name)
                    this.setState({
                        selected_colormap_name: new_cm_name,
                        show_new_colormap_modal: false,
                    })
                    toast.success("Colormap created successfully", {position: toast.POSITION.BOTTOM_CENTER})
                }
            })
        }
    }

    saveColormap(name, colormap=this.state.current_colormap){
        if(name){
            try{
                return vcs.setcolormap(name, colormap).then(() => {
                    if (colormap != this.state.current_colormap){
                      this.setState({current_colormap: colormap})
                    }
                    this.props.saveColormap(name, colormap)
                    toast.success("Save Successful", { position: toast.POSITION.BOTTOM_CENTER });
                    PubSub.publish(PubSubEvents.colormap_update, name)
                },
                (error) => {
                    console.warn(error)
                    try{
                        toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                    }
                    catch(e){
                        toast.error("Failed to save colormap", { position: toast.POSITION.BOTTOM_CENTER });
                    }
                })
            }
            catch(e){
                console.warn(e)
                toast.error("Failed to save colormap", { position: toast.POSITION.BOTTOM_CENTER });
                return Promise.reject()
            }
        }
        else{ // should not be possible, but just in case
            toast.error("Please enter a name to save this colormap", { position: toast.POSITION.BOTTOM_CENTER });
            return Promise.reject()
        }
    }

    handleApplyColormap(){
        const colormap_name = this.state.selected_colormap_name
        const cell_row = this.props.selected_cell_row
        const cell_col = this.props.selected_cell_col
        const graphics_method_parent = this.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method_parent
        const graphics_method = this.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method

        let applyColormapHelper = () => {
            try{
                let new_graphics_method = _.clone(this.props.graphics_methods[graphics_method_parent][graphics_method])
                const prev_colormap = new_graphics_method.colormap
                new_graphics_method.colormap = colormap_name
                this.props.updateGraphicsMethod(new_graphics_method)
                let plot = this.props.sheet.cells[cell_row][cell_col].plots[0]
                this.props.applyColormap(plot.graphics_method_parent, graphics_method, cell_row, cell_col, 0)
                if(prev_colormap === colormap_name){ // if the colormap has changed but the name hasnt, the canvas will not render
                    PubSub.publish(PubSubEvents.colormap_update, colormap_name)
                }
                return true
            }
            catch(e){
                return false
            }

        }
        return new Promise((resolve, reject) => {
            try{
                /* eslint-disable no-undef */
                if(vcs){
                    vcs.getcolormapnames().then((names) => {
                        if(names.indexOf(colormap_name) >= 0){
                            vcs.setcolormap(colormap_name, this.state.current_colormap).then(() => { // save colormap in vcs
                                this.props.saveColormap(colormap_name, this.state.current_colormap) // save to the frontend state
                                if(applyColormapHelper()){
                                    resolve()
                                }
                                else{
                                    reject()
                                }
                            })
                        }
                        else{
                            vcs.createcolormap(colormap_name).then(() => {
                                vcs.setcolormap(colormap_name, this.state.current_colormap).then(() => {
                                    this.props.saveColormap(colormap_name, this.state.current_colormap) // save to the frontend state
                                    if(applyColormapHelper()){
                                        resolve()
                                    }
                                    else{
                                        reject()
                                    }
                                })
                            })
                        }
                    })
                }
                /* eslint-enable no-undef */
            }
            catch(e){
                reject(e)
            }
        })
    }

    resetColormap(){
        if(this.state.selected_colormap_name){
            this.handleSelectColormap(this.state.selected_colormap_name)
        }
    }

    createNewColormapInVcs(base_cm, name){
        // create should copy the current colormap, save it into vcs,
        // add it to redux and set it as active in the widget, and close the modal
        // cancel should close the modal
        try{
            /* eslint-disable no-undef */
            return vcs.createcolormap(name, base_cm).then((result)=>{
                this.props.saveColormap(name, result)
                return true
            },
            (error)=>{
                try{
                    toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                }
                catch(e){
                    toast.error("Failed to create colormap", {position: toast.POSITION.BOTTOM_CENTER})
                }
                console.warn(error)
                return false
            })
        }
        catch(e){
            console.warn(e)
            toast.error("Failed to create colormap", {position: toast.POSITION.BOTTOM_CENTER})
        }
        return Promise.resolve(false)

    }

    blendColors(){
        let startCell = Math.min(this.state.selected_cells_start, this.state.selected_cells_end)
        let endCell = Math.max(this.state.selected_cells_start, this.state.selected_cells_end)
        let numCells = Math.abs(this.state.selected_cells_start - this.state.selected_cells_end) - 1
        if(numCells < 1 || this.state.selected_cells_start === -1 || this.state.selected_cells_end === -1){
            // numCells represents the number of cells in between the start and end cells.
            // so selecting 2 cells gives numCells a value of 0.
            toast.info("Not enough cells selected to blend. Shift + click to select more.", {
                position: toast.POSITION.BOTTOM_CENTER
              });
            return
        }
        let startColor = this.state.current_colormap[startCell] // rgba array
        let endColor = this.state.current_colormap[endCell] // rgba array
        let redStep = (endColor[0] - startColor[0]) / (numCells+1)
        let greenStep = (endColor[1] - startColor[1]) / (numCells+1)
        let blueStep = (endColor[2] - startColor[2]) / (numCells+1)
        let currentCell = startCell + 1
        let blendedColormap = this.state.current_colormap.map(function(arr) {
            return arr.slice(); // copy inner array of colors
        });

        for(let count = 1; currentCell < endCell; currentCell++, count++){
            blendedColormap[currentCell][0] = startColor[0] + (redStep * count)
            blendedColormap[currentCell][1] = startColor[1] + (greenStep * count)
            blendedColormap[currentCell][2] = startColor[2] + (blueStep * count)
        }
        this.setState({current_colormap: blendedColormap})
    }

    render(){
        const apply_disabled = this.props.selected_cell_row === -1 || this.props.selected_cell_col === -1
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                    <div id='colormap-editor-main'>
                        <Modal.Header closeButton>
                            <Modal.Title>Editing Colormap: {this.state.selected_colormap_name}&nbsp;
                                <Button onClick={() => this.props.startTour(2)} className="help-button main-help btn btn-xs btn-default">
                                    <i className="glyphicon glyphicon-question-sign" />Help
                                </Button>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-inline " style={{display: "flex", justifyContent: "center"}}>
                                <div className="form-group">
                                    <label htmlFor="cm-select" className="control-label">Colormaps</label>
                                    <select id='colormap-dropdown'
                                        name="cm-select"
                                        className="form-control example"
                                        style={{marginLeft: "5px", marginRight: "5px"}}
                                        onChange={(event) => {this.handleSelectColormap(event.target.value)}}
                                        value={this.state.selected_colormap_name}>
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
                                        id='btn-new-colormap'
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
                                onChange={(color) => {this.handleChange(color)}}
                            />
                            <ColormapWidget
                                current_colormap={this.state.current_colormap}
                                color={this.state.currentColor}
                                handleCellClick={(start_cell, end_cell) => {this.handleCellClick(start_cell, end_cell)}}
                                selected_cells_start={this.state.selected_cells_start}
                                selected_cells_end= {this.state.selected_cells_end}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                id='btn-blend'
                                style={{float: "left"}}
                                onClick={() => {this.blendColors()}}>
                                Blend
                            </Button>
                            <Button
                                style={{float: "left"}}
                                onClick={() => {this.resetColormap()}}>
                                Reset
                            </Button>
                            <Button
                                style={{float: "left"}}
                                disabled={apply_disabled}
                                title={ apply_disabled ?
                                    "A cell must be selected to apply a colormap"
                                    :
                                    "Apply the colormap shown to the currently selected cell"
                                }
                                onClick={() => {this.handleApplyColormap()}}>
                                Apply
                            </Button>
                            <Button id='btn-save-colormap' onClick={() => {this.saveColormap(this.state.selected_colormap_name)}} bsStyle="primary">Save</Button>
                            <Button id='btn-import-export' onClick={this.openImportExportModal.bind(this)}>Import/Export</Button>
                            <Button onClick={this.props.close}>Close</Button>
                        </Modal.Footer>
                    </div>
                </Modal>
                <NewColormapModal
                    show={this.state.show_new_colormap_modal}
                    close={() => this.setState({show_new_colormap_modal: false})}
                    newColormap={(name) => this.createNewColormap(name)}
                />
                <ImportExportModal
                    show={this.state.show_import_export_modal}
                    close={()=>{this.closeImportExportModal()}}
                    current_colormap={this.state.current_colormap}
                    current_colormap_name={this.state.selected_colormap_name}
                    saveColormap={(name, cm) => this.saveColormap(name, cm)}
                    createNewColormap={(name, cm) => this.createNewColormap(name, cm)}
                />
            </div>
        )
    }
}

ColormapEditor.defaultProps = {
    default_colormap: 'viridis'
}

const mapStateToProps = (state) => {
    let cell_id_string = state.present.sheets_model.selected_cell_id // format of `sheet_row_col`. Ex: "0_0_0"
    let sheet_row_col = cell_id_string.split("_").map(function (str_val) { return Number(str_val) })
    let row = sheet_row_col[1]
    let col = sheet_row_col[2]
    return {
        sheet: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index],
        graphics_methods: state.present.graphics_methods,
        selected_cell_row: row,
        selected_cell_col: col,
        colormaps: state.present.colormaps,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveColormap: (name, colormap) => {
            if(name){
                let cm = {};
                cm[name] = colormap;
                try{
                    dispatch(Actions.saveColormap(cm));
                    return true
                }
                catch(e){
                    console.error(e)
                    return false
                }
            }
            return false

        },
        applyColormap: (graphics_method_parent, graphics_method, row, col, plot_index) =>{
            dispatch(Actions.swapGraphicsMethodInPlot(graphics_method_parent, graphics_method, row, col, plot_index));
        },
        updateGraphicsMethod: (graphics_method) => {
            dispatch(Actions.updateGraphicsMethod(graphics_method))
        },
        deleteColormap: (name) => {
            dispatch(Actions.deleteColormap(name));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColormapEditor);
export {ColormapEditor as PureColormapEditor}
