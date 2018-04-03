import React, { Component } from 'react'
import { Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class SavePlot extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "NewPlot"
        }
    }
    
    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Rename variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>Variable name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" onClick={this.props.onTryClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

SavePlot.propTypes = {
    onTryClose: React.PropTypes.func,
    show: React.PropTypes.bool,
}

export default SavePlot