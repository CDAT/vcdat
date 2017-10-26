import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ColormapWidget.css'

class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: "",
        }
    }

    static get propTypes() { 
        return { 
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
        }; 
    }

    handleChange(e) {
        this.setState({filename: e.target.value})
    }

    render(){
        return(
            <div>
                <Modal id="export-modal" show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Export Current Colormap</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" value={this.state.filename} onChange={(e)=>{this.handleChange(e)}}></input>
                        <Button className="btn btn-primary">Download</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ExportModal;