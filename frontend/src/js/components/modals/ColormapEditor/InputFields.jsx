import React, { Component } from 'react';

var { EditableInput} = require('react-color/lib/components/common');

class InputFields extends Component{
    constructor(props){
        super(props);
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
                        value={ this.props.hsv.h }
                        onChange={this.testChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Sat"
                        value={ this.props.hsv.s }
                        onChange={this.props.onChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Val"
                        value={ this.props.hsv.v }
                        onChange={this.props.onChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Hex"
                        value={ this.props.hex }
                        onChange={this.props.onChange}
                    />
                </div>
                <div style={styles.rgb} >
                    <EditableInput
                        style={ styles.inputBox }
                        label="Red"
                        value={ this.props.rgb.r }
                        onChange={this.props.onChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Green"
                        value={ this.props.rgb.g }
                        onChange={this.props.onChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Blue"
                        value={ this.props.rgb.b }
                        onChange={this.props.onChange}
                    />
                    <EditableInput
                        style={ styles.inputBox }
                        label="Alpha"
                        value={ this.props.rgb.a }
                        onChange={this.props.onChange}
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