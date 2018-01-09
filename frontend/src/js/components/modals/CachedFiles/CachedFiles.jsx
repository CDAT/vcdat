import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import './CachedFiles.scss';
import FileTab from './Tabs/FileTab.jsx'
// import Esgf from './Tabs/EsgfTab.jsx'
// import OpendapTab from './Tabs/OpendapTab.jsx'
// import EditTab from './Tabs/EditTab.jsx'
import InfoTab from './Tabs/InfoTab.jsx'


class CachedFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: props.selectedTab,
        }
    }

    switchTab(tab){
        this.setState({selectedTab: tab})
    }

    render() {
        return (
            <Modal className='cached-files' bsSize="large" show={this.props.show} onHide={this.props.onTryClose}>
                    {
                        this.state.selectedTab == 'esgf' ? <div className="Dummy-esgf-component">ESGF</div> :
                        this.state.selectedTab == 'opendap' ? <div className="Dummy-opendap-component">OpenDAP</div> :
                        this.state.selectedTab == 'edit' ? <div className="Dummy-edit-component">Edit</div> :
                    this.state.selectedTab == 'info' ? <InfoTab {...this.props} switchTab={this.switchTab.bind(this)} selectedTab={this.state.selectedTab}/> :
                        <FileTab {...this.props} switchTab={this.switchTab.bind(this)} selectedTab={this.state.selectedTab}></FileTab>
                    }
            </Modal>
        )
    }
}

CachedFiles.propTypes = {
    show: React.PropTypes.bool.isRequired,
    onTryClose: React.PropTypes.func.isRequired,
    selectedTab: React.PropTypes.string,
}

CachedFiles.defaultProps = {
    selectedTab: 'file'
};

export default CachedFiles