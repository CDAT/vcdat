import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'

class AxisTransform extends PureComponent {
    constructor(props){
        super(props)
    } 

    render(){
        return (
            <DropdownButton
                bsStyle="default"
                id={`${this.props.axis_name}-axis-transform`}
                title={this.props.axis_transform}
                style={{marginLeft: "10px", width: "55px"}}
                onSelect={(transform) => { this.props.handleAxisTransform(this.props.axis_name, transform) }}
            >
                <MenuItem eventKey="def">def Default Axis Points</MenuItem>
                <MenuItem eventKey="avg">avg Average of Selected Axis Points</MenuItem>
                <MenuItem eventKey="std">std Standard Deviation of Selected Axis Points</MenuItem>
            </DropdownButton>
        )
    }
}

AxisTransform.propTypes = {
    axis_name: PropTypes.string.isRequired,
    axis_transform: PropTypes.string.isRequired,
    handleAxisTransform: PropTypes.func.isRequired,
}

export default AxisTransform