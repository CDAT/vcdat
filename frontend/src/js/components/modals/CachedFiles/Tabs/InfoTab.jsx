import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import TabBar from './TabBar.jsx'
class InfoTab extends Component{

    render(){
        return(
            <div>
               <Modal.Header closeButton>
                    <Modal.Title>Variable Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TabBar switchTab={this.props.switchTab} selectedTab={this.props.selectedTab}/>
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
    onTryClose: React.PropTypes.func,
    switchTab: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
}
export default InfoTab