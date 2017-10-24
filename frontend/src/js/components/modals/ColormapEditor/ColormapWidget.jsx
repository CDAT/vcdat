import React, { Component } from 'react';
import { connect } from 'react-redux'
import Actions from '../../../constants/Actions.js'
var colorUtility = require('react-color/lib/helpers/color.js').default

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
            selectedColormapName: undefined, // a string, such as 'viridis', or 'AMIP'
            shouldUseProps: false, // value to indicate if color should be applied from props to color map
        }
    }

    static get propTypes() { 
        return { 
            colormaps: React.PropTypes.object, // object containing all colormaps. 
            defaultColormap: React.PropTypes.string, // The name of the colormap to select when opening the editor
            color: React.PropTypes.object,// the current colorpicker color 
            onChange: React.PropTypes.func,
            saveColormap: React.PropTypes.func,
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
        // we need a copy of the base colormap for editing. 
        // javascript .slice() does not do a deep copy so we need to copy each inner array of colors per cell
        let currentColormap = this.props.colormaps[name].map(function(arr) {
            return arr.slice(); // copy inner array of colors
        });
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

    render(){
        return(
            <div>
                <div className="form-inline" style={{display: "flex", marginTop: "20px", marginBottom: "10px"}} >
                    <select 
                        className="form-control"
                        style={{marginRight: "5px"}}
                        onChange={(event) => {this.handleColormapSelect(event.target.value)}}
                        value={this.state.selectedColormapName}>
                        { this.props.colormaps ? (
                            Object.keys(this.props.colormaps).sort().map( name => ( <option key={name} value={name}>{name}</option> ))
                            ) : (
                            <option value="" disabled />    
                        )}
                    </select>
                    <input 
                        className="form-control"
                        style={{flexGrow: 1}} 
                        value={this.state.newColormapTemplateName}
                        onChange={(event) => { this.setState({newColormapTemplateName: event.target.value}) }}
                        >
                    </input>
                    <button className="form-control" style={{marginLeft: "5px"}} 
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveColormap: (name, colormap) => {
            let cm = {};
            cm[name] = colormap;
            dispatch(Actions.saveColormap(cm));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ColormapWidget)