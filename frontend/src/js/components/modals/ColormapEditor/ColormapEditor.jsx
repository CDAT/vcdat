import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

import ColorPicker from './ColorPicker.jsx'
import ColormapWidget from './ColormapWidget.jsx'
var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333")
        }
    }

    static get propTypes() { 
        return { 
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
        }; 
    }

    handleChange(color) {
        this.setState({ currentColor: color })
    }

    render(){
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Colormap Editor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ColorPicker 
                            color={this.state.currentColor}
                            onChange={(color) => {this.handleChange(color)}}/>
                        <ColormapWidget 
                            ref="widget"
                            color={this.state.currentColor} 
                            onChange={(color) => {this.handleChange(color)}}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().blendColors()}}>
                            Blend
                        </Button>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().resetColormap()}}>
                            Reset
                        </Button>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {}}>
                            Apply
                        </Button>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ColormapEditor;