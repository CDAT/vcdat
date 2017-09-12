import React, { Component } from 'react';
// import _ from 'lodash';
import { Modal, Button } from 'react-bootstrap';

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Text in a modal</h4>
                    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                    <hr />
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