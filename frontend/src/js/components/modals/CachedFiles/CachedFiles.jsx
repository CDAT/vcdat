import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import './CachedFiles.scss';
import FileTab from './Tabs/FileTab.jsx'
// import Esgf from 'Tabs/EsgfTab.jsx'
// import OpendapTab from 'Tabs/OpendapTab.jsx'
// import EditTab from 'Tabs/EditTab.jsx'
// import InfoTab from 'Tabs/InfoTab.jsx'


class CachedFiles extends Component {
    constructor(props) {
        super(props);
        
        let selectedTab;
        if(this.props.editMode){
            selectedTab = 'edit';
        }
        else{
            selectedTab = 'file';
        }
        
        this.state = {
            selectedTab: selectedTab,
        }
    }

    switchTab(tab){
        console.log(tab)
        this.setState({selectedTab: tab})
    }

    render() {
        console.log(this.state.selectedTab)
        return (
            <Modal className='cached-files' bsSize="large" show={this.props.show} onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Load Variable</Modal.Title>
                </Modal.Header>
                    {
                        this.state.selectedTab == 'esgf' ? <div className="Dummy-esgf-component">ESGF</div> :
                        this.state.selectedTab == 'opendap' ? <div className="Dummy-opendap-component">OpenDAP</div> :
                        this.state.selectedTab == 'edit' ? <div className="Dummy-edit-component">Edit</div> :
                        this.state.selectedTab == 'info' ? <div className="Dummy-info-component">Info</div> :
                        <FileTab {...this.props} switchTab={this.switchTab.bind(this)} selectedTab={this.state.selectedTab}></FileTab>
                    }
            </Modal>
        )
    }
}

CachedFiles.propTypes = {
    show: React.PropTypes.bool.isRequired,
    onTryClose: React.PropTypes.func.isRequired,
}

export default CachedFiles