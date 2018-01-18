import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import './CachedFiles.scss';
import FileTab from './Tabs/FileTab.jsx'
// import Esgf from './Tabs/EsgfTab.jsx'
// import OpendapTab from './Tabs/OpendapTab.jsx'
import InfoTab from './Tabs/InfoTab.jsx'
import { tabs } from "./Tabs/TabBar.jsx"


class CachedFiles extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal className='cached-files' bsSize="large" show={this.props.show} onHide={this.props.onTryClose}>
                    {
                        this.props.selectedTab == tabs.esgf ? <div className="Dummy-esgf-component">ESGF</div> :
                        this.props.selectedTab == tabs.opendap ? <div className="Dummy-opendap-component">OpenDAP</div> :
                        this.props.selectedTab == tabs.info ? <InfoTab {...this.props} switchTab={this.props.switchTab.bind(this)} selectedTab={this.props.selectedTab}/> :
                        <FileTab {...this.props} switchTab={this.props.switchTab.bind(this)} selectedTab={this.props.selectedTab}></FileTab>
                    }
            </Modal>
        )
    }
}

CachedFiles.propTypes = {
    show: React.PropTypes.bool.isRequired,
    onTryClose: React.PropTypes.func.isRequired,
    selectedTab: React.PropTypes.string,
    switchTab: React.PropTypes.func,
    active_variable: React.PropTypes.string,
}

CachedFiles.defaultProps = {
    selectedTab: 'file'
};

export default CachedFiles
