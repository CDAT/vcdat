import React, { Component } from 'react';

class ColormapWidget extends Component {
    constructor(props){
        super(props)
        this.state = {
            colormaps: undefined,
            currentCell: 0,
            currentColormap: undefined, //a string, such as 'viridis', or 'AMIP'
        }
        this.fetchColormaps()
    }

    fetchColormaps(){
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {this.loadColormaps(xhr)})
        xhr.open('GET', '/getColormaps');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    loadColormaps(xhr){
        if(xhr.readyState === 4 && xhr.status === 200){
            this.setState((prevState, props) => {
                try {
                    let newState = {colormaps: JSON.parse(xhr.responseText)}
                    if(prevState.currentColormap === undefined){
                        if(newState.colormaps[this.props.defaultColormap]){
                            newState.currentColormap = this.props.defaultColormap
                        }
                        else{
                            newState.currentColormap = Object.keys(newState.colormaps)[0]
                        }
                    }
                    return newState
                } catch(e){
                    console.error(e)
                }
                
            })
        }
    }
    render(){
        return(
            <div>
                <div>
                    <select value={this.props.defaultColormap} >
                    { this.state.colormaps ? (
                        Object.keys(this.state.colormaps).sort().map( name => ( <option key={name} value={name}>{name}</option> ))
                        ) : (
                        <option value="" disabled />    
                    )}
                    </select>
                </div>
                <div>Cells go here</div>
            </div>
        )
    }
}

ColormapWidget.defaultProps = {
    defaultColormap: 'viridis'
}

export default ColormapWidget;