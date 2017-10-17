import React, { Component } from 'react';
var colorUtility = require('react-color/lib/helpers/color.js').default

class ColormapWidget extends Component {
    constructor(props){
        super(props)
        this.state = {
            colormaps: undefined,
            selectedCellsStart: 0,
            selectedCellsEnd: 0,
            currentColormap: undefined, // an array of arrays representing the current cells
            selectedColormapName: undefined, // a string, such as 'viridis', or 'AMIP'
            shouldUseProps: false, // value to indicate if color should be applied from props to color map
        }
        this.fetchColormaps()
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
    

    fetchColormaps(){
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {this.loadColormaps(xhr)})
        xhr.open('GET', '/getColormaps');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    handleColormapSelect(name){
        // we need a copy of the base colormap for editing. 
        // javascript .slice() does not do a deep copy so we need to copy each inner array of colors per cell
        let currentColormap = this.state.colormaps[name].map(function(arr) {
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

    loadColormaps(xhr){
        if(xhr.readyState === 4 && xhr.status === 200){
            this.setState((prevState, props) => {
                try {
                    let newState = {colormaps: JSON.parse(xhr.responseText)}
                    if(prevState.selectedColormapName === undefined){
                        if(newState.colormaps[this.props.defaultColormap]){
                            newState.selectedColormapName = this.props.defaultColormap
                        }
                        else{
                            newState.selectedColormapName = Object.keys(newState.colormaps)[0]
                        }
                        newState.currentColormap = newState.colormaps[newState.selectedColormapName].map(function(arr) {
                            return arr.slice(); // copy inner array of colors
                        });
                    }
                    return newState
                } catch(e){
                    console.error(e)
                }
                
            })
        }
    }

    cellActive(index, start, end){
        // if multiple cells are selected check if it is between the two
        if(index >= Math.min(start, end) && index <= Math.max(start, end)){
            return true
        }
        return false
    }

    saveColormap(){
        console.log(this.state.newColormapTemplateName)
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
                        onChange={(event) => {this.handleColormapSelect(event.target.value)}} value={this.state.selectedColormapName} >
                        { this.state.colormaps ? (
                            Object.keys(this.state.colormaps).sort().map( name => ( <option key={name} value={name}>{name}</option> ))
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
                    <button className="form-control" style={{marginLeft: "5px"}} onClick={() => {this.saveColormap()}}>Save as...</button>
                </div>
                <div style={{overflowY: "scroll", maxHeight: "250px"}}>
                { (this.state.currentColormap) ? 
                    (
                        this.state.currentColormap.map( (cell, index) => (
                        <div
                            className="cells"
                            key={`${index}${cell[0]}${cell[1]}${cell[2]}${cell[3]}`} // need a key that changes when the color does and is unique
                            style={{
                                width:"30px",
                                height: "25px", // must match line height
                                border:(this.cellActive(index, this.state.selectedCellsStart, this.state.selectedCellsEnd)) ? 
                                        "2px solid black" : "2px solid lightgrey",
                                display: "inline-block",
                                background: `rgb(${Math.round(cell[0]*2.55)}, ${Math.round(cell[1]*2.55)}, ${Math.round(cell[2]*2.55)}`,
                                color: ((cell[0]*0.299 + cell[1]*0.587 + cell[2]*0.114)*2.55 > 186) ? ("#000000") : ("#ffffff"),
                                // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color  
                                textAlign: "center",
                                verticalAlign: "middle",
                                lineHeight: "25px", // Must match height
                                MozUserSelect: "none",
                                WebkitUserSelect: "none",
                                msUserSelect: "none", // Styles that prevent text highlight when selecting cells
                                userSelect: "none",
                                OUserSelect: "none",
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

export default ColormapWidget;