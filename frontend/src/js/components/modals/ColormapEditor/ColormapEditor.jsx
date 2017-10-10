import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

import ColorPicker from './ColorPicker.jsx'

var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333")
        }
    }

    handleChange(color) {
        this.setState({ currentColor: color})
    }

    render(){
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Colormap Editor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ColorPicker color={this.state.currentColor} onChange={(color) => {this.handleChange(color)}}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

ColormapEditor.PropTypes = {
    show: React.PropTypes.bool.isRequired,
    close: React.PropTypes.func.isRequired
}
export default ColormapEditor; 