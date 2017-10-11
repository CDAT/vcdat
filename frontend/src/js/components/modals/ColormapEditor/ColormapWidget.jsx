import React, { Component } from 'react';

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
        if(!this.state.shouldUseProps){
            this.setState({shouldUseProps: true})
            return
        }
        else{
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

    render(){
        return(
            <div>
                <div>
                    <select onChange={(event) => {this.handleColormapSelect(event.target.value)}} value={this.state.selectedColormapName} >
                    { this.state.colormaps ? (
                        Object.keys(this.state.colormaps).sort().map( name => ( <option key={name} value={name}>{name}</option> ))
                        ) : (
                        <option value="" disabled />    
                    )}
                    </select>
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
                    )
                    }
                    
                </div>
            </div>
        )
    }
}

ColormapWidget.defaultProps = {
    defaultColormap: 'viridis'
}

export default ColormapWidget;