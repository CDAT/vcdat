import React, { Component } from 'react';
import './ColormapWidget.css'
var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapWidget extends Component {
    constructor(props){
        super(props)
    }

    static get propTypes() {
        return {
            current_colormap: React.PropTypes.array,
            color: React.PropTypes.object,// the current colorpicker color 
            selected_cells_start: React.PropTypes.number,
            selected_cells_end: React.PropTypes.number,
            handleCellClick: React.PropTypes.func,
        }
    }

    handleCellClick(event){
        if(event.target.innerText){
            const index = Number.parseInt(event.target.innerText)
            if(isNaN(index)){
                return
            }
            if(event.shiftKey){
                if(this.props.selected_cells_start === -1){
                    this.props.handleCellClick(0, index, r, g, b)
                }
                else{
                    this.props.handleCellClick(this.props.selected_cells_start, index, r, g, b)
                }
            }
            else{
                if(this.props.selected_cells_start === this.props.selected_cells_end && this.props.selected_cells_start === index){
                    // if a single cell is selected and the user clicks it. Deselect the cell
                    this.props.handleCellClick(-1, -1, r, g, b)
                }
                else{
                    this.props.handleCellClick(index, index, r, g, b)
                }   
            }
            const r = this.props.current_colormap[index][0] * 2.55
            const g = this.props.current_colormap[index][1] * 2.55
            const b = this.props.current_colormap[index][2] * 2.55
            // this.handleChange(colorUtility.toState(`rgb(${r},${g},${b})`))
        }
    }

    cellActive(index, start, end){
        // if multiple cells are selected check if it is between the two
        if(index >= Math.min(start, end) && index <= Math.max(start, end)){
            return true
        }
        return false
    }

    render(){
        return(
            <div>
                <span style={{fontSize: 11, fontWeight: 300}}title="*Shift+Click to select multiple cells">*Shift+Click to select multiple cells</span>
                <div id="colormap-cells-container">
                { (this.props.current_colormap) ? 
                    (
                        this.props.current_colormap.map( (cell, index) => (
                        <div
                            className="cells"
                            key={`${index}${cell[0]}${cell[1]}${cell[2]}${cell[3]}`} // need a key that changes when the color does and is unique
                            style={{
                                border:(this.cellActive(index, this.props.selected_cells_start, this.props.selected_cells_end)) ? 
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

export default ColormapWidget