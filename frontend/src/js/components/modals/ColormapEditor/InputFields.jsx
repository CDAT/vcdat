import React, { Component } from 'react';
var colorUtility = require('react-color/lib/helpers/color.js').default
var { EditableInput} = require('react-color/lib/components/common');


class InputFields extends Component{
    constructor(props){
        super(props);
    }

    static get propTypes() { 
        return {
            onChange: React.PropTypes.func,
            rgb: React.PropTypes.object.isRequired,
            hsv: React.PropTypes.object.isRequired,
            hex: React.PropTypes.string.isRequired,
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
                justifyContent: "space-between"
            },
            hsv:{
                display: "inline-flex"
            },
            rgb:{
                display: "inline-flex"
            },
            inputBox: {
                wrap: {
                    display: "flex",
                    flexDirection: "column-reverse",
                    position: ""
                },
                input:{
                    width: "35px"
                },
                label: {
                    fontSize: '12px',
                    color: '#999',
                }
            },
            hex: {
                wrap: {
                    display: "flex",
                    flexDirection: "column-reverse"
                },
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
                <div style={styles.rgb} >
                    <EditableInput
                        className="input-box-Hex"
                        style={ styles.hex }
                        label="Hex"
                        value={ this.props.hex }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Red"
                        style={ styles.inputBox }
                        label="R"
                        value={ this.props.rgb.r }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Green"
                        style={ styles.inputBox }
                        label="G"
                        value={ this.props.rgb.g }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Blue"
                        style={ styles.inputBox }
                        label="B"
                        value={ this.props.rgb.b }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Alpha"
                        style={ styles.inputBox }
                        label="A"
                        value={ this.props.rgb.a }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                </div>
                <div style={styles.hsv} >
                    <EditableInput
                        className="input-box-Hue"
                        style={ styles.inputBox }
                        label="H"
                        value={ Math.round(this.props.hsv.h) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Saturation"
                        style={ styles.inputBox }
                        label="S"
                        value={ Math.round(this.props.hsv.s * 100) }
                        onChange={(val, e) => {this.handleChange(val, e)}}
                    />
                    <EditableInput
                        className="input-box-Value"
                        style={ styles.inputBox }
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