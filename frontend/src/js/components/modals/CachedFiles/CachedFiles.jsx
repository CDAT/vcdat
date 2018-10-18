import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import './CachedFiles.scss'
import FileTab from './Tabs/FileTab.jsx'
// import Esgf from './Tabs/EsgfTab.jsx'
// import OpendapTab from './Tabs/OpendapTab.jsx'
import TabBar from '../../TabBar/TabBar.jsx'

class CachedFiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            selected_tab: 0,
            tabs: [
                {
                    id: "file",
                    display_name: "File",
                },
                {
                    id: "esgf",
                    display_name: "ESGF",
                    disabled: true,
                },
                {
                    id: "opendap",
                    display_name: "OpenDAP",
                    disabled: true,
                },
            ]
        }
        this.switchTab = this.switchTab.bind(this)
    }

    //Added this function to cause this component to become an error boundary and catch issues with loading files/variables.
    componentDidCatch(error, info) {
        this.setState({hasError: true});
        console.log(error);
    }

    switchTab(index){
        this.setState({selected_tab: index});
    }

    render() {
        return (
            <Modal className='cached-files' bsSize="large" show={this.props.show} onHide={this.props.onTryClose}>
                <div id='load-variable-form'>
                    <Modal.Header closeButton>
                        {
                            this.state.selected_tab === 3 ? (
                                <Modal.Title>Variable Info</Modal.Title>
                            ) : (
                                <Modal.Title>Load Variable &nbsp;
                                    <Button onClick={() => this.props.startTour(3)} className='help-button main-help btn btn-xs btn-default'>
                                        <i className='glyphicon glyphicon-question-sign' />Help
                                    </Button>
                                </Modal.Title>
                            )
                        }
                    </Modal.Header>
                    <TabBar tabs={this.state.tabs} selected_tab={this.state.selected_tab} switchTab={this.switchTab} />
                        {
                            this.state.selected_tab == 1 ? <div className="Dummy-esgf-component">ESGF</div> :
                            this.state.selected_tab == 2 ? <div className="Dummy-opendap-component">OpenDAP</div> :
                            <FileTab {...this.props} hasError={this.state.hasError} handleError={()=>{this.setState({hasError: false})}} />
                        }
                </div>
            </Modal>
        )
    }
}

CachedFiles.propTypes = {
    show: PropTypes.bool.isRequired,
    startTour: PropTypes.func,
    onTryClose: PropTypes.func.isRequired,
}

export default CachedFiles
