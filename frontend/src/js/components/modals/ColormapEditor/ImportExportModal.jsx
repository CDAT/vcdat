import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ColormapWidget.css'

class ImportExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            data: "",
        }
    }

    static get propTypes() { 
        return { 
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
            currentColormap: React.PropTypes.array
        }; 
    }

    handleChange(e) {
        let colormap = {
            name: e.target.value,
            colormap: this.props.currentColormap,
        }
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colormap));
        this.setState({
            name: e.target.value,
            data: data
        })
    }

    render(){
        return(
            <div>
                <Modal id="export-modal" show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Export Current Colormap</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" value={this.state.name} onChange={(e)=>{this.handleChange(e)}}></input>
                        <Button 
                            className="btn btn-primary" 
                            href={this.state.data}
                            download={this.state.name}>
                            Download</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ImportExportModal;