import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import TabBar from '../TabBar/TabBar.jsx'
import SavePlot from './SavePlot/SavePlot.jsx'

class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                {
                    id: "plot",
                    display_name: "Plots",
                },
                {
                    id: "vcs",
                    display_name: "Vcs",
                    disabled: true,
                },
            ],
            selected_tab: 0
        }
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(index){
        this.setState({selected_tab: index})
    }

    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Export</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TabBar tabs={this.state.tabs} selected_tab={this.state.selected_tab} switchTab={this.switchTab}/>
                    <hr/>
                    {
                        this.state.selected_tab === 1 ? "Not yet implemented" : <SavePlot />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}


ExportModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
}

export default ExportModal
