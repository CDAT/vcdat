import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Actions from '../../constants/Actions.js'
import { Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
import { toast } from 'react-toastify'

class GraphicsMethodCreator extends Component {
    constructor(props){
        super(props)
        let default_gm_type = ""
        let default_gm_method = ""
        const gm_types = Object.keys(props.graphics_methods)

        if(gm_types.length > 0) {
            default_gm_type = props.graphics_methods[0] // just grab the first one each time since there isnt really a default
        }

        if(default_gm_type){ // can't select a graphics method if the types weren't defined
            const gm_methods = Object.keys(props.graphics_methods[default_gm_type])
            if(gm_methods.indexOf("default") >= 0) {
                default_gm_method = "default"
            }
            else if(gm_methods.length > 0) {
                default_gm_method = gm_methods[0]
            }
        }
        
        this.state = {
            new_gm_name: "",
            validation_state: null,
            selected_gm_type: default_gm_type,
            selected_gm_method: default_gm_method,
        }

        this.createGraphicsMethod = this.createGraphicsMethod.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const name = event.target.value
        const validation_state = this.getValidationState(name, this.state.selected_gm_type)
        this.setState({new_template_name: name, validation_state: validation_state})
    }

    getValidationState(name, gm_type){
        if(name.length === 0 || gm_type === "" ){
            return null
        }
        else if(Object.keys(this.props.graphics_methods[gm_type]).indexOf(name) > -1) {
            return "error"
        }
        return "success"
    }

    createTemplate() {
        try {
            return vcs.creategraphicsmethod(this.state.selected_gm_type, this.state.new_gm_name, this.state.selected_gm_method).then(
                (/* success */) => {
                    this.props.createGraphicsMethod(this.state.selected_gm_type, this.state.new_gm_name)
                    toast.success("Graphics Method created successfully!", {position: toast.POSITION.BOTTOM_CENTER})
                    this.props.close()
                },
                /* istanbul ignore next */
                (error) => {
                    console.warn("Error while creating Graphics Method: ", error)
                    try{
                        toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                    }
                    catch(e){
                        toast.error("Failed to create template", {position: toast.POSITION.BOTTOM_CENTER})
                    }
                }
            )
        }
        catch(e) {
            /* istanbul ignore next */
            console.warn(e)
            /* istanbul ignore next */
            toast.error("An error occurred while creating the template. Try restarting vCDAT.")
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a Graphics Method</Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.state.validation_state}
                    >
                        <ControlLabel>New Graphics Method Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.new_gm_name}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>
                            { this.state.validation_state === "error" ? "A graphics method with that name already exists." : null }
                        </HelpBlock>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelectType">
                        <ControlLabel>Base Graphics Type</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={this.state.selected_gm_type}
                            onChange={(e)=>this.setState({selected_gm_type: e.target.value})}
                        >
                        {
                            Object.keys(this.props.graphics_methods).map((name) => {
                                return <option key={name} value={name}>{name}</option>
                            })
                        }
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelectMethod">
                        <ControlLabel>Base Graphics Method</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={this.state.selected_gm_method}
                            onChange={(e)=>this.setState({selected_gm_method: e.target.value})}
                        >
                        { this.props.graphics_methods[this.state.selected_gm_type] ?
                            Object.keys(this.props.graphics_methods[this.state.selected_gm_type]).map((name) => {
                                return <option key={name} value={name}>{name}</option>
                            })
                            :
                                <option value=""></option>
                        }
                        </FormControl>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle="primary"
                        disabled={this.state.validation_state !== "success" } 
                        onClick={this.createTemplate}
                    >Create
                    </Button>
                    <Button onClick={this.props.close} bsStyle="default">Cancel</Button>    
                </Modal.Footer>
            </Modal>
        );
    }
}

GraphicsMethodCreator.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    graphics_methods: PropTypes.objectOf(
        PropTypes.objectOf(
            PropTypes.object
        )
    ),
    createGraphicsMethod: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => {
    return {
        createGraphicsMethod: (type, name) => {
            dispatch(Actions.createGraphicsMethod(type, name))
        }
    }
}
export { GraphicsMethodCreator as PureGraphicsMethodCreator}
export default connect(null, mapDispatchToProps)(GraphicsMethodCreator);
