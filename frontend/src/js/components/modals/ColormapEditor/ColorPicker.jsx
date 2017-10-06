import React, { Component } from 'react';

import reactCSS from 'reactcss'
import {CustomPicker, SketchPicker} from 'react-color';
// import * as Saturation from 'react-color/lib/components/common'
// var { Saturation } = require('react-color/lib/components/common');
var { Saturation } = require('react-color/lib/components/common');


class ColorPicker extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        const styles = reactCSS({
            'default': {
                color: {
                  width: '15px',
                  height: '15px',
                  borderRadius: '2px',
                  background: this.props.color.hex
                },
                swatch: {
                  padding: '2px',
                  background: '#fff',
                  borderRadius: '1px',
                  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                  display: 'inline-block',
                  cursor: 'pointer',
                },
                saturation:{
                    width: "200px",
                    height: "200px",
                    position: "relative",
                    float: "right",
                }
            }
        });
        return(
            <div className="clearfix">
                <div style={ styles.swatch }>
                    <div style={ styles.color } />
                </div>
                <div style={styles.saturation}>
                    <Saturation
                        {...this.props.color}
                        onChange={ this.props.onChange }
                    />
                </div>
            </div>
        )
    }
}

ColorPicker.PropTypes = {
    color: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
}


export default CustomPicker(ColorPicker);