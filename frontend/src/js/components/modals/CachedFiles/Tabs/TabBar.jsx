import React, { PureComponent } from 'react'
import { Button } from 'react-bootstrap'

class TabBar extends PureComponent{

    render(){
        return(
            <div className="text-center variable-tabs">
                <Button id="tabbar-file" bsSize="small" bsStyle={this.props.selectedTab == "file" ? 'primary' : 'default'} onClick={() => {this.props.switchTab('file')}}>File</Button>
                <Button id="tabbar-esgf" disabled bsSize="small" bsStyle={this.props.selectedTab == "esfg" ? 'primary' : 'default'} onClick={() => {this.props.switchTab('esgf')}}>ESGF</Button>
                <Button id="tabbar-opendap" disabled bsSize="small" bsStyle={this.props.selectedTab == "opendap" ? 'primary' : 'default'} onClick={() => {this.props.switchTab('opendap')}}>OpenDAP</Button>
                <Button id="tabbar-edit" disabled bsSize="small" bsStyle={this.props.selectedTab == "edit" ? 'primary' : 'default'} onClick={() => {this.props.switchTab('edit')}}>Edit</Button>
                <Button id="tabbar-info" bsSize="small" bsStyle={this.props.selectedTab == "info" ? 'primary' : 'default'} onClick={() => {this.props.switchTab('info')}}>Info</Button>
            </div>
        )
    }
}

TabBar.propTypes = {
    switchTab: React.PropTypes.func,
    selectedTab: React.PropTypes.string,
}
export default TabBar