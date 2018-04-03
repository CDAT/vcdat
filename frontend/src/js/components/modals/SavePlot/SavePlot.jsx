import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class SavePlot extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "NewPlot"
        }
    }
    
    render(){
        return(
                    <FormGroup>
                        <ControlLabel>Variable name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })} />
                    </FormGroup>
        )
    }
}

SavePlot.propTypes = {
    onTryClose: React.PropTypes.func,
    show: React.PropTypes.bool,
}

export default SavePlot