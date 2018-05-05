import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'

class AxisTransform extends PureComponent {
    constructor(props){
        super(props)
    } 

    render(){
        return(
            <DropdownButton
                bsStyle="default"
                id={`${this.props.axis_name}-axis-transform`}
                title={this.props.axis_transform}
                onSelect={(transform) => { this.props.handleChange(this.props.axis_name, transform) }}
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
    handleChange: PropTypes.func.isRequired,
}

export default AxisTransform