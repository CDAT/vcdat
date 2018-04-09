import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

class TabBar extends PureComponent{

    render(){
        return(
            this.props.tabs ?
                <div className={`text-center ${this.props.class}`}>
                {
                    this.props.tabs.map((tab, index) =>{
                        return(
                            <Button
                                key={index}
                                disabled={tab.disabled}
                                id={`tabbar-${tab.id}`}
                                bsSize={this.props.tab_size}
                                bsStyle={this.props.selected_tab === index ? this.props.selected_style : this.props.default_style}
                                onClick={() => {this.props.switchTab(index)}}>
                                {tab.display_name}
                            </Button>
                        )
                    })
                }
                </div>
            :
                null
        )
    }
}

TabBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired,
        class: PropTypes.string,
        disabled: PropTypes.bool,
    })),
    class: PropTypes.string,
    tab_size: PropTypes.string,
    default_style: PropTypes.string,
    selected_style: PropTypes.string,
    selected_tab: PropTypes.number.isRequired,
    switchTab: PropTypes.func.isRequired,
}

TabBar.defaultProps = {
    class: "",
    tab_size: "small", // must be in ["lg", "large", "sm", "small", "xs", "xsmall"]
    default_style: "default", // must be in ["lg", "large", "sm", "small", "xs", "xsmall"]
    selected_style: "primary",
  };

export default TabBar