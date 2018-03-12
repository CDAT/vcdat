import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import Actions from '../../../constants/Actions.js'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../constants/PubSubEvents.js'
var colorUtility = require('react-color/lib/helpers/color.js').default
import ImportExportModal from "./ImportExportModal.jsx";
import { toast } from 'react-toastify'
import './ColormapWidget.css'

class ColormapWidget extends Component {
    constructor(props){
        super(props)
        this.state = {
            selectedCellsStart: -1,
            selectedCellsEnd: -1,
            currentColormap: this.props.colormaps[this.props.defaultColormap].map(function(arr) {
                return arr.slice()
            }), // an array of arrays representing the current cells 
            selectedColormapName: this.props.defaultColormap, // a string, such as 'viridis', or 'AMIP'
            showExportModal: false,
        }
    }

    static get propTypes() { 
        return { 
            colormaps: React.PropTypes.object, // object containing all colormaps. 
            defaultColormap: React.PropTypes.string, // The name of the colormap to select when opening the editor
            color: React.PropTypes.object,// the current colorpicker color 
            onChange: React.PropTypes.func,
            saveColormap: React.PropTypes.func,
            showImportExportModal: React.PropTypes.bool,
            closeImportExportModal: React.PropTypes.func,
            sheet: React.PropTypes.object,
            applyColormap: React.PropTypes.func,
            graphics_methods: React.PropTypes.object,
        }; 
    }

    componentWillReceiveProps(nextProps){
        if(this.state.currentColormap && this.state.selectedCellsStart !== -1 && this.state.selectedCellsEnd !== -1){
            let updatedColormap = this.state.currentColormap.slice()
            updatedColormap[this.state.selectedCellsEnd][0] = Math.round((nextProps.color.rgb.r / 255) * 100)
            updatedColormap[this.state.selectedCellsEnd][1] = Math.round((nextProps.color.rgb.g / 255) * 100)
            updatedColormap[this.state.selectedCellsEnd][2] = Math.round((nextProps.color.rgb.b / 255) * 100)
            this.setState({currentColormap: updatedColormap})
        }
    }

    handleColormapSelect(name){
        let currentColormap = _.map(this.props.colormaps[name], _.clone())
        this.setState({
            selectedColormapName: name,
            currentColormap: currentColormap,
            selectedCellsStart: -1,
            selectedCellsEnd: -1,
        })
    }

    handleCellClick(event){
        if(event.target.innerText){
            let index = Number.parseInt(event.target.innerText)
            if(isNaN(index)){
                return 
            }
            if(event.shiftKey){
                if(this.state.selectedCellsStart === -1){
                    this.setState({
                        selectedCellsStart: 0,
                        selectedCellsEnd: index
                    })
                }
                else{
                    this.setState({selectedCellsEnd: index})
                }
            }
            else{
                if(this.state.selectedCellsStart === this.state.selectedCellsEnd && this.state.selectedCellsStart === index){
                    // if a single cell is selected and the user clicks it. Deselect the cell
                    this.setState({selectedCellsEnd: -1, selectedCellsStart: -1})
                }
                else{
                    this.setState({selectedCellsEnd: index, selectedCellsStart: index})
                }
                
            }
            let r = this.state.currentColormap[index][0] * 2.55
            let g = this.state.currentColormap[index][1] * 2.55
            let b = this.state.currentColormap[index][2] * 2.55
            this.props.onChange(colorUtility.toState(`rgb(${r},${g},${b})`))
        }
    }

    cellActive(index, start, end){
        // if multiple cells are selected check if it is between the two
        if(index >= Math.min(start, end) && index <= Math.max(start, end)){
            return true
        }
        return false
    }

    resetColormap(){
        if(this.state.selectedColormapName){
            this.handleColormapSelect(this.state.selectedColormapName)
        }
    }

    createNewColormap(base_cm, name){
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

    saveColormap(name){
        if(name){
            try{
                return vcs.setcolormap(name, this.state.currentColormap).then(() => {
                    this.props.saveColormap(name, this.state.currentColormap)
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

    blendColors(){
        let startCell = Math.min(this.state.selectedCellsStart, this.state.selectedCellsEnd)
        let endCell = Math.max(this.state.selectedCellsStart, this.state.selectedCellsEnd)
        let numCells = Math.abs(this.state.selectedCellsStart - this.state.selectedCellsEnd) - 1
        if(numCells < 1 || this.state.selectedCellsStart === -1 || this.state.selectedCellsEnd === -1){
            // numCells represents the number of cells in between the start and end cells.
            // so selecting 2 cells gives numCells a value of 0.
            toast.info("Not enough cells selected to blend. Shift + click to select more.", {
                position: toast.POSITION.BOTTOM_CENTER
              });
            return
        }
        let startColor = this.state.currentColormap[startCell] // rgba array
        let endColor = this.state.currentColormap[endCell] // rgba array
        let redStep = (endColor[0] - startColor[0]) / (numCells+1)
        let greenStep = (endColor[1] - startColor[1]) / (numCells+1)
        let blueStep = (endColor[2] - startColor[2]) / (numCells+1)
        let currentCell = startCell + 1
        let blendedColormap = this.state.currentColormap.map(function(arr) {
            return arr.slice(); // copy inner array of colors
        });
        
        for(let count = 1; currentCell < endCell; currentCell++, count++){
            blendedColormap[currentCell][0] = startColor[0] + (redStep * count)
            blendedColormap[currentCell][1] = startColor[1] + (greenStep * count)
            blendedColormap[currentCell][2] = startColor[2] + (blueStep * count)
        }
        this.setState({currentColormap: blendedColormap})
    }

    applyColormap(colormap_name, cell_row, cell_col){
        let self = this
        let graphics_method_parent = self.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method_parent
        let graphics_method = self.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method

        function applyColormapHelper(){
            try{
                let new_graphics_method = _.clone(self.props.graphics_methods[graphics_method_parent][graphics_method])
                const prev_colormap = new_graphics_method.colormap
                new_graphics_method.colormap = colormap_name
                self.props.updateGraphicsMethod(new_graphics_method)
                let plot = self.props.sheet.cells[cell_row][cell_col].plots[0]
                self.props.applyColormap(plot.graphics_method_parent, graphics_method, cell_row, cell_col, 0)
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
                            vcs.setcolormap(colormap_name, self.state.currentColormap).then(() => { // save colormap in vcs
                                self.props.saveColormap(colormap_name, self.state.currentColormap) // save to the frontend state
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
                                vcs.setcolormap(colormap_name, self.state.currentColormap).then(() => {
                                    self.props.saveColormap(colormap_name, self.state.currentColormap) // save to the frontend state
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

    render(){
        return(
            <div>
                <span style={{fontSize: 11, fontWeight: 300}}title="*Shift+Click to select multiple cells">*Shift+Click to select multiple cells</span>
                <div id="colormap-cells-container">
                { (this.state.currentColormap) ? 
                    (
                        this.state.currentColormap.map( (cell, index) => (
                        <div
                            className="cells"
                            key={`${index}${cell[0]}${cell[1]}${cell[2]}${cell[3]}`} // need a key that changes when the color does and is unique
                            style={{
                                border:(this.cellActive(index, this.state.selectedCellsStart, this.state.selectedCellsEnd)) ? 
                                        "2px solid black" : "2px solid lightgrey",
                                background: `rgb(${Math.round(cell[0]*2.55)}, ${Math.round(cell[1]*2.55)}, ${Math.round(cell[2]*2.55)}`,
                                color: ((cell[0]*0.299 + cell[1]*0.587 + cell[2]*0.114)*2.55 > 186) ? ("#000000") : ("#ffffff"),
                                // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color  
                            }}
                            onClick={ (e) => {this.handleCellClick(e)} }
                        >
                            {index}
                        </div>
                        ), this) 
                    ) : (
                        <span></span>
                    )}
                </div>
                <ImportExportModal
                    show={this.props.showImportExportModal}
                    close={this.props.closeImportExportModal}
                    currentColormap={this.state.currentColormap}
                    saveColormap={this.props.saveColormap}
                />
            </div>
        )
    }
}

ColormapWidget.defaultProps = {
    defaultColormap: 'viridis'
}

const mapStateToProps = (state) => {
    return {
        colormaps: state.present.colormaps,
        sheet: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index],
        graphics_methods: state.present.graphics_methods,
    }
}

const mapDispatchToProps = dispatch => {
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ColormapWidget)
export {ColormapWidget as PureColormapWidget}