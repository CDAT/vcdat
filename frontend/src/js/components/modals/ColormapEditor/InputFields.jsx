import React, { Component } from 'react';
var colorUtility = require('react-color/lib/helpers/color.js').default
var { EditableInput} = require('react-color/lib/components/common');


class InputFields extends Component{
    constructor(props){
        super(props);
    }

    handleChange(val, e){
        if (val['Hex']) {
          colorUtility.isValidHex(val['Hex']) && this.props.onChange({
            hex: val['Hex'],
            source: 'hex',
          }, e)
        } else if (val.Red || val.Green || val.Blue) {
          this.props.onChange({
            r: val.Red || this.props.rgb.r,
            g: val.Green || this.props.rgb.g,
            b: val.Blue || this.props.rgb.b,
            source: 'rgb',
          }, e)
        } else if (val.Hue || val.Saturation || val.Value) {
          this.props.onChange({
            h: val.Hue || this.props.hsv.h,
            s: val.Saturation || this.props.hsv.s,
            v: val.Value || this.props.hsv.v,
            source: 'hsv',
          }, e)
        }
      }

    render(){
        const styles = {
            container:{
                float: "right"
            },
            hsv:{
                float: "left"
            },
            rgb:{
                float: "right"
            },
            inputBox: {
                input:{
                    width: "35px"
                },
                label: {
                    fontSize: '12px',
                    color: '#999',
                }
            },
            hex: {
                input:{
                    width: "70px"
                },
                label: {
                    fontSize: '12px',
                    color: '#999',
                }
            },
        }

        return(
            <div style={styles.container}>
                <div style={styles.hsv} >
                    <EditableInput
                        style={ styles.inputBox }
                        label="Hue"
                        value={ Math.round(this.props.hsv.h) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Saturation"
                        value={ Math.round(this.props.hsv.s * 100) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Value"
                        value={ Math.round(this.props.hsv.v * 100) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.hex }
                        label="Hex"
                        value={ this.props.hex }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
                <div style={styles.rgb} >
                    <EditableInput
                        style={ styles.inputBox }
                        label="Red"
                        value={ this.props.rgb.r }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Green"
                        value={ this.props.rgb.g }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Blue"
                        value={ this.props.rgb.b }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Alpha"
                        value={ this.props.rgb.a }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
            </div>
        )
    }
}

InputFields.PropTypes = {
    onChange: React.PropTypes.func,
}

export default InputFields;