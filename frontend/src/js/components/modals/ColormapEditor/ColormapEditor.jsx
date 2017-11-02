import React, { Component } from 'react';
import { Modal, Button, Dropdown, MenuItem } from 'react-bootstrap';

import ColorPicker from './ColorPicker.jsx'
import ColormapWidget from './ColormapWidget.jsx'
var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333"),
            showImportExportModal: false,
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

    closeImportExportModal(){
        this.setState({showImportExportModal: false})
    }

    openImportExportModal(){
        this.setState({showImportExportModal: true})
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
                            onChange={(color) => {this.handleChange(color)}}
                            showImportExportModal={this.state.showImportExportModal}
                            closeImportExportModal={this.closeImportExportModal.bind(this)}/>
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
                        <Dropdown 
                            dropup
                            id="colormap-apply-dropup"
                            style={{float: "left", marginLeft: "5px"}}>
                            <Dropdown.Toggle>Apply</Dropdown.Toggle>
                            <Dropdown.Menu className="colormap-apply-menu">
                                <MenuItem eventKey="0" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>To Top Left</MenuItem>
                                <MenuItem eventKey="1" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 1)}}>To Top Right</MenuItem>
                                <MenuItem eventKey="2" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 0)}}>To Bottom Left</MenuItem>
                                <MenuItem eventKey="3" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 1)}}>To Bottom Right</MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button onClick={this.openImportExportModal.bind(this)}>Import/Export</Button>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ColormapEditor;