import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import Actions from '../../../constants/Actions.js'
var colorUtility = require('react-color/lib/helpers/color.js').default
import ImportExportModal from "./ImportExportModal.jsx";
import './ColormapWidget.css'

class ColormapWidget extends Component {
    constructor(props){
        super(props)
        this.state = {
            selectedCellsStart: 0,
            selectedCellsEnd: 0,
            currentColormap: this.props.colormaps[this.props.defaultColormap].map(function(arr) {
                return arr.slice()
            }), // an array of arrays representing the current cells 
            selectedColormapName: this.props.defaultColormap, // a string, such as 'viridis', or 'AMIP'
            shouldUseProps: false, // value to indicate if color should be applied from props to color map
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
            deleteColormap: React.PropTypes.func,
            showImportExportModal: React.PropTypes.bool,
            closeImportExportModal: React.PropTypes.func,
            cur_sheet_index: React.PropTypes.number,
            sheet_num_rows: React.PropTypes.number,
            sheet_num_cols: React.PropTypes.number,
            sheet: React.PropTypes.object,
            applyColormap: React.PropTypes.func,
            graphics_methods: React.PropTypes.object,
        }; 
    }

    componentWillReceiveProps(nextProps){
        // The current color selected by the color picker is passed in as a prop
        // Since we do not want to change the colormap right when the component opens, 
        // we ignore the first time the prop is given
        // After that, we update the currently selected cell with the nextProps.color value
        if(!this.state.shouldUseProps){
            this.setState({shouldUseProps: true})
            return
        }
        else{
            if(this.state.currentColormap){
                let updatedColormap = this.state.currentColormap.map(function(arr) {
                    return arr.slice(); 
                    // Note: we might not need to deep copy. this could hurt performance
                });
                updatedColormap[this.state.selectedCellsEnd][0] = Math.round((nextProps.color.rgb.r / 255) * 100)
                updatedColormap[this.state.selectedCellsEnd][1] = Math.round((nextProps.color.rgb.g / 255) * 100)
                updatedColormap[this.state.selectedCellsEnd][2] = Math.round((nextProps.color.rgb.b / 255) * 100)
                this.setState({currentColormap: updatedColormap})
            }
        }
    }

    handleColormapSelect(name){
        let currentColormap = _.map(this.props.colormaps[name], _.clone())
        this.setState({
            selectedColormapName: name,
            currentColormap: currentColormap
        })
    }

    handleCellClick(event){
        if(event.target.innerText){
            let index = Number.parseInt(event.target.innerText)
            if(isNaN(index)){
                return 
            }
            if(event.shiftKey){
                this.setState({selectedCellsEnd: index})
            }
            else{
                this.setState({selectedCellsEnd: index, selectedCellsStart: index})
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

    handleDeleteColormap(){
        let nameToDelete = this.state.selectedColormapName
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
        setTimeout(()=>{
            this.setState({
                selectedColormapName: name,
                currentColormap: currentColormap,
            })  
        }, 0)
        
    }

    blendColors(){
        let startCell = Math.min(this.state.selectedCellsStart, this.state.selectedCellsEnd)
        let endCell = Math.max(this.state.selectedCellsStart, this.state.selectedCellsEnd)
        let numCells = Math.abs(this.state.selectedCellsStart - this.state.selectedCellsEnd) - 1
        if(numCells < 1){
            // numCells represents the number of cells in between the start and end cells.
            // so selecting 2 cells gives numCells a value of 0.
            return
        }
        let startColor = this.state.currentColormap[startCell] // rgba array
        let endColor = this.state.currentColormap[endCell] // rgba array
        let redStep = (endColor[0] - startColor[0]) / numCells
        let greenStep = (endColor[1] - startColor[1]) / numCells
        let blueStep = (endColor[2] - startColor[2]) / numCells
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

    applyColormap(cell_row, cell_col){
        let self = this
        let graphics_method_parent = self.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method_parent
        let graphics_method = self.props.sheet.cells[cell_row][cell_col].plots[0].graphics_method
        let colormap_name = "applied_colormap"

        function applyColormapHelper(){
            let new_graphics_method = _.clone(self.props.graphics_methods[graphics_method_parent][graphics_method])
            new_graphics_method.colormap = colormap_name
            self.props.updateGraphicsMethod(new_graphics_method)
            let plot = self.props.sheet.cells[cell_row][cell_col].plots[0]
            self.props.applyColormap(plot.graphics_method_parent, graphics_method, cell_row, cell_col, 0)
        }

        /* eslint-disable no-undef */ 
        if(vcs){
            vcs.colormapnames().then((names) => {
                if(names.indexOf(colormap_name) >= 0){
                    vcs.setcolormap(colormap_name, self.state.currentColormap).then(() => { // save colormap in vcs
                        self.props.saveColormap(colormap_name, self.state.currentColormap) // save to the frontend state
                        applyColormapHelper()
                    })
                }
                else{
                    vcs.createcolormap(colormap_name).then(() => {
                        vcs.setcolormap(colormap_name, self.state.currentColormap).then(() => {
                            self.props.saveColormap(colormap_name, self.state.currentColormap) // save to the frontend state
                            applyColormapHelper()
                        })
                    })
                }
            })
        }
        /* eslint-enable no-undef */
    }

    render(){
        return(
            <div>
                <div className="form-inline" style={{display: "flex", marginTop: "20px", marginBottom: "10px"}}>
                    <button 
                        title="Delete Selected Colormap"
                        onClick={() => {this.handleDeleteColormap()}}
                        className="btn btn-danger btn-sm"
                        style={{marginRight: "5px"}}>
                        <i className="glyphicon glyphicon-trash"></i>
                    </button>
                    <select 
                        className="form-control"
                        style={{marginRight: "5px"}}
                        onChange={(event) => {this.handleColormapSelect(event.target.value)}}
                        value={this.state.selectedColormapName}>
                        { this.props.colormaps ? (
                            Object.keys(this.props.colormaps).sort(function (a, b) {
                                return a.toLowerCase().localeCompare(b.toLowerCase());
                            }).map( name => ( <option key={name} value={name}>{name}</option> ))
                            ) : (
                            <option value="" disabled />
                        )}
                    </select>
                    <input 
                        className="form-control"
                        style={{flexGrow: 1}} 
                        value={this.state.newColormapTemplateName}
                        onChange={(event) => { this.setState({newColormapTemplateName: event.target.value}) }}>
                    </input>
                    <button 
                        className="form-control"
                        style={{marginLeft: "5px"}} 
                        onClick={() => {
                            this.props.saveColormap(this.state.newColormapTemplateName, this.state.currentColormap)
                        }}>Save as...
                    </button>
                </div>
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
        cur_sheet_index: state.present.sheets_model.cur_sheet_index,
        sheet_num_rows: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].row_count,
        sheet_num_cols: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].col_count,
        sheet: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index],
        graphics_methods: state.present.graphics_methods,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveColormap: (name, colormap) => {
            let cm = {};
            cm[name] = colormap;
            dispatch(Actions.saveColormap(cm));
        },
        deleteColormap: (name) => {
            dispatch(Actions.deleteColormap(name));
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