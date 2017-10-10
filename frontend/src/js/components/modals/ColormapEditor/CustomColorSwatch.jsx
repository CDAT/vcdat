import React, { Component } from 'react';
import reactCSS from 'reactcss'

var { CompactColor } = require('react-color/lib/components/compact/CompactColor');

class CustomColorSwatch extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentCell: 0,
            colors: props.colors
        }
    }

    addCustomColor(){
        let newState = Object.assign({}, this.state);
        newState.colors[newState.currentCell] = this.props.hex;
        newState.currentCell = newState.currentCell + 1;
        this.setState({newState});
    }
    handleClick(hex, index){
        this.setState((prevState, props) => {
            return {currentCell: index};
        });
        if(hex === "#FFFFFF"){
            return
        }
        else{
            this.props.onChange(hex)
        }
    }

    render(){
        const styles = reactCSS({
            'default': {
                Compact: {
                    background: '#f6f6f6',
                    radius: '4px',
                },
                compact: {
                    paddingTop: '5px',
                    paddingLeft: '5px',
                    boxSizing: 'initial',
                    width: '180px',
                    float: "left",
                },
                clear: {
                    clear: 'both',
                },
            },
        })

        return(
            <div style={styles.compact}>
                { this.props.colors.map( (c, index) => (
                    <CompactColor
                    key={ index }
                    color={ c }
                    active={ index === this.state.currentCell }
                    onClick={ (hex) => {this.handleClick(hex, index)} }
                    />
                ), this) }
                <div style={ styles.clear }>
                    <button className="btn btn-sm btn-default" onClick={() => {this.addCustomColor()}}>Add to Custom Colors</button>
                </div>
            </div>
        )
    }
}

CustomColorSwatch.defaultProps = {
    colors: [
        '#FFFFFF', '#FFFFFF', '#FFFFFF','#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
        '#FFFFFF', '#FFFFFF', '#FFFFFF','#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
    ]
}

CustomColorSwatch.PropTypes = {
    colors: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func,
    hex: React.PropTypes.string,
}

export default CustomColorSwatch;