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
                  width: '36px',
                  height: '14px',
                  borderRadius: '2px',
                  background: `rgba(${ this.props.color.r }, ${ this.props.color.g }, ${ this.props.color.b }, ${ this.props.color.a })`,
                },
                swatch: {
                  padding: '5px',
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
                }
            }
        });
        return(
            <div>
                <Saturation
                    style={styles.saturation}
                    {...this.props.color}
                    onChange={ this.props.onChange }
                />
                <div style={ styles.swatch }>
                    <div style={ styles.color } />
                </div>
            </div>
        )
    }
}

ColorPicker.PropTypes = {
    hsl: React.PropTypes.any,
    hsv: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired
}


export default CustomPicker(ColorPicker);