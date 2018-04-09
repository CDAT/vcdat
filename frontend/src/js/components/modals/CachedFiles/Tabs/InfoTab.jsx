import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
class InfoTab extends Component{

    render(){
        return(
            <div>
                <Modal.Body>
                    <div>
                        Variable info goes here...
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="infotab-close" bsStyle="default" bsSize="small" onClick={() => this.props.onTryClose()}>Close</Button>
                </Modal.Footer>
            </div>
        )
    }
}

InfoTab.propTypes = {
    onTryClose: PropTypes.func,
    switchTab: PropTypes.func,
    selectedTab: PropTypes.string,
}
export default InfoTab