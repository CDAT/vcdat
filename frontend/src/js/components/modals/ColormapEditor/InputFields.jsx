import React, { Component } from 'react'
import PropTypes from 'prop-types'
var colorUtility = require('react-color/lib/helpers/color.js').default
var { EditableInput} = require('react-color/lib/components/common')


class InputFields extends Component{
    constructor(props){
        super(props);
    }

    static get propTypes() { 
        return {
            onChange: PropTypes.func,
            rgb: PropTypes.object.isRequired,
            hsv: PropTypes.object.isRequired,
            hex: PropTypes.string.isRequired,
        }; 
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
                display: "flex",
                flex: "1", // take up any unused width
                justifyContent: "space-evenly",
                paddingBottom: "2px",
                marginRight: "50px",
            },
            hex:{
                display: "inline-flex",
                marginLeft: "10px",
            },
            rgb:{
                display: "inline-flex",
                marginLeft: "10px",
            },
            hsv:{
                display: "inline-flex",
                marginLeft: "10px",
            },
            hex_input: {
                wrap: {
                    display: "flex",
                    flexDirection: "column-reverse",
                    marginLeft: "5px",
                },
                input:{
                    width: "70px",
                },
                label: {
                    fontSize: '12px',
                    color: '#999',
                },
            },
            input_box: {
                wrap: {
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    marginLeft: "5px",
                },
                input:{
                    width: "35px",
                },
                label: {
                    fontSize: '12px',
                    color: '#999',
                },
            },
        }

        return(
            <div style={styles.container}>
                <div style={styles.hex}>
                    <EditableInput
                        className="input-box-Hex"
                        style={ styles.hex_input }
                        label="Hex"
                        value={ this.props.hex }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
                <div style={styles.rgb} >
                    <EditableInput
                        className="input-box-Red"
                        style={ styles.input_box }
                        label="R"
                        value={ this.props.rgb.r }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Green"
                        style={ styles.input_box }
                        label="G"
                        value={ this.props.rgb.g }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Blue"
                        style={ styles.input_box }
                        label="B"
                        value={ this.props.rgb.b }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Alpha"
                        style={ styles.input_box }
                        label="A"
                        value={ this.props.rgb.a }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
                <div style={styles.hsv} >
                    <EditableInput
                        className="input-box-Hue"
                        style={ styles.input_box }
                        label="H"
                        value={ Math.round(this.props.hsv.h) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Saturation"
                        style={ styles.input_box }
                        label="S"
                        value={ Math.round(this.props.hsv.s * 100) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Value"
                        style={ styles.input_box }
                        label="V"
                        value={ Math.round(this.props.hsv.v * 100) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
            </div>
        )
    }
}

export default InputFields;