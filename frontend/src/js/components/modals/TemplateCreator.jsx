import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Actions from '../../constants/Actions.js'
import { Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
import { toast } from 'react-toastify'

class TemplateCreator extends Component {
    constructor(props){
        super(props)
        let default_base_template = ""
        if(props.templates.indexOf("default") >= 0) {
            default_base_template = "default"
        }
        else if(props.templates.length > 0) {
            default_base_template = props.templates[0]
        }

        this.state = {
            new_template_name: "",
            validation_state: null,
            selected_base_template: default_base_template
        }

        this.createTemplate = this.createTemplate.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const name = event.target.value
        const validation_state = this.getValidationState(name)
        this.setState({new_template_name: name, validation_state: validation_state})
    }

    getValidationState(name){
        if(name.length === 0){
            return null
        }
        else if(this.props.templates.indexOf(name) > -1) {
            return "error"
        }
        return "success"
    }

    createTemplate() {
        try {
            return vcs.createtemplate(this.state.new_template_name, this.state.selected_base_template).then(
                (/* success */) => {
                    this.props.createTemplate(this.state.new_template_name)
                    toast.success("Template created successfully!", {position: toast.POSITION.BOTTOM_CENTER})
                    this.props.close()
                },
                /* istanbul ignore next */
                (error) => {
                    console.warn("Error while creating template: ", error)
                    if(error.data && error.data.exception) {
                        toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                    }
                    else{
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
                    <Modal.Title>Create a Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.state.validation_state}
                    >
                        <ControlLabel>New Template Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.new_template_name}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>
                            { this.state.validation_state === "error" ? "A template with that name already exists." : null }
                        </HelpBlock>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Base Template</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={this.state.selected_base_template}
                            onChange={(e)=>this.setState({selected_base_template: e.target.value})}
                        >
                        {
                            this.props.templates.map((name) => {
                                return <option key={name} value={name}>{name}</option>
                            })
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

TemplateCreator.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    templates: PropTypes.arrayOf(PropTypes.string),
    createTemplate: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTemplate: (name) => {
            dispatch(Actions.createTemplate(name))
        }
    }
}
export { TemplateCreator as PureTemplateCreator}
export default connect(null, mapDispatchToProps)(TemplateCreator);
