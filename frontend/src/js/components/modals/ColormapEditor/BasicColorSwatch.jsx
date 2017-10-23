import React, { Component } from 'react';
import reactCSS from 'reactcss'

var { CompactColor } = require('react-color/lib/components/compact/CompactColor');

class BasicColorSwatch extends Component{
    constructor(props){
        super(props);
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
                    width: '240px',
                    float: "left",
                },
                clear: {
                    clear: 'both',
                },
            },
        })

        return(
            <div style={styles.compact}>
            <div>Basic Colors</div>
                { this.props.colors.map( c => (
                    <CompactColor
                    key={ c }
                    color={ c }
                    active={ c.toLowerCase() === this.props.hex }
                    onClick={ (hex, e) => {this.props.onChange(hex, e)} }
                    />
                ), this) }
                <div style={ styles.clear } />
            </div>
        )
    }
}

BasicColorSwatch.defaultProps = {
    colors: [
        '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
        '#333333', '#808080', '#cccccc', '#D33115','#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', 
        '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E']
}



BasicColorSwatch.PropTypes = {
    colors: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func,
}

export default BasicColorSwatch;