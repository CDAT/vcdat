import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Actions from "../../constants/Actions.js";
import { Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

class GraphicsMethodCreator extends Component {
    constructor(props) {
        super(props);
        let default_gm_type = "";
        let default_gm_method = "";
        const gm_types = Object.keys(props.graphics_methods);

        if (gm_types.length > 0) {
            default_gm_type = Object.keys(props.graphics_methods)[0]; // just grab the first one each time since there isnt really a default
        }

        if (default_gm_type) {
            // can't select a graphics method if the types weren't defined
            const gm_methods = Object.keys(props.graphics_methods[default_gm_type]);
            if (gm_methods.indexOf("default") >= 0) {
                default_gm_method = "default";
            } else if (gm_methods.length > 0) {
                default_gm_method = gm_methods[0];
            }
        }

        this.state = {
            new_gm_name: "",
            validation_state: null,
            selected_gm_type: default_gm_type,
            selected_gm_method: default_gm_method,
            error_message: ""
        };

        this.createGraphicsMethod = this.createGraphicsMethod.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleChange(event) {
        const name = event.target.value;
        const { status: validation_state, message } = this.getValidationState(name, this.state.selected_gm_type);
        this.setState({ new_gm_name: name, validation_state: validation_state, error_message: message });
    }

    handleKeyPress(event) {
        if(event.charCode === 13 && this.state.validation_state === "success") {
            this.createGraphicsMethod()
        }
    }

    getValidationState(name, gm_type) {
        // Checks if the given input is a valid name for a new GM
        // returns an object with the following keys:
        //    status: A string or null that indicates the validity of the input
        //    message: A string that contains the error message to display when the status is "error"
        if (name.length === 0 || gm_type === "") {
            return { status: null, message: "" };
        } else if (Object.keys(this.props.graphics_methods[gm_type]).indexOf(name) > -1) {
            return { status: "error", message: "A Graphics Method with that name already exists" };
        } else if (name.startsWith("__")) {
            return { status: "error", message: "Graphics Method names should not start with two underscores" };
        }
        return { status: "success", message: "" };
    }

    createGraphicsMethod() {
        try {
            return vcs.creategraphicsmethod(this.state.selected_gm_type, this.state.new_gm_name, this.state.selected_gm_method).then(
                (/* success */) => {
                    this.props.createGraphicsMethod(this.state.new_gm_name, this.state.selected_gm_type, this.state.selected_gm_method);
                    toast.success("Graphics Method created successfully!", { position: toast.POSITION.BOTTOM_CENTER });
                    this.props.close();
                },
                /* istanbul ignore next */
                error => {
                    console.warn("Error while creating Graphics Method: ", error);
                    try {
                        toast.error(error.data.exception, { position: toast.POSITION.BOTTOM_CENTER });
                    } catch (e) {
                        toast.error("Failed to create Graphics Method", { position: toast.POSITION.BOTTOM_CENTER });
                    }
                }
            );
        } catch (e) {
            /* istanbul ignore next */
            console.warn(e);
            /* istanbul ignore next */
            toast.error("An error occurred while creating the Graphics Method. Try restarting vCDAT.");
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a Graphics Method</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <FormGroup controlId="formControlsSelectType">
                                <ControlLabel>Base Graphics Type</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    value={this.state.selected_gm_type}
                                    onChange={e => this.setState({ selected_gm_type: e.target.value })}
                                >
                                    {Object.keys(this.props.graphics_methods)
                                        .sort(function(a, b) {
                                            return a.toLowerCase().localeCompare(b.toLowerCase());
                                        })
                                        .map(name => {
                                            return (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            );
                                        })}
                                </FormControl>
                                <HelpBlock style={{ fontSize: "12px" }}>Select a type for your new graphics method</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup controlId="formControlsSelectMethod">
                                <ControlLabel>Base Graphics Method</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    value={this.state.selected_gm_method}
                                    onChange={e => this.setState({ selected_gm_method: e.target.value })}
                                >
                                    {this.props.graphics_methods[this.state.selected_gm_type] ? (
                                        Object.keys(this.props.graphics_methods[this.state.selected_gm_type])
                                            .sort(function(a, b) {
                                                return a.toLowerCase().localeCompare(b.toLowerCase());
                                            })
                                            .map(name => {
                                                return (
                                                    <option key={name} value={name}>
                                                        {name}
                                                    </option>
                                                );
                                            })
                                    ) : (
                                        <option value="" />
                                    )}
                                </FormControl>
                                <HelpBlock style={{ fontSize: "12px" }}>Select an existing graphics method to copy and use as a base.</HelpBlock>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup controlId="formBasicText" validationState={this.state.validation_state}>
                        <ControlLabel>New Graphics Method Name</ControlLabel>
                        <FormControl type="text" value={this.state.new_gm_name} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
                        <FormControl.Feedback />
                        <HelpBlock>{this.state.validation_state === "error" ? this.state.error_message : null}</HelpBlock>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" disabled={this.state.validation_state !== "success"} onClick={this.createGraphicsMethod}>
                        Create
                    </Button>
                    <Button onClick={this.props.close} bsStyle="default">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

GraphicsMethodCreator.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    graphics_methods: PropTypes.objectOf(PropTypes.objectOf(PropTypes.object)),
    createGraphicsMethod: PropTypes.func,
    selectGraphicsMethod: PropTypes.func
};

/* istanbul ignore next */
const mapStateToProps = state => {
    return {
        gms: state.present.graphics_methods
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    return {
        createGraphicsMethod: (name, type, base) => {
            dispatch(Actions.createGraphicsMethod(name, type, base));
        }
    };
};
export { GraphicsMethodCreator as PureGraphicsMethodCreator };
export default connect(mapStateToProps, mapDispatchToProps)(GraphicsMethodCreator);
