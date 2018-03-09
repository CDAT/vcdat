import React, { Component } from 'react'
import { Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class NewColormapModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
        }
    }
    
    render(){
        return(
            <Modal show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Create Colormap</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        bsStyle="primary"
                        bsSize="small"
                        onClick={() => {this.props.newColormap(this.state.name)
                        }}>Create</Button>
                    <Button 
                        bsSize="small"
                        onClick={() => this.props.close()}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

NewColormapModal.propTypes = {
    show: React.PropTypes.bool,
    close: React.PropTypes.func,
    newColormap: React.PropTypes.func,
}

export default NewColormapModal
