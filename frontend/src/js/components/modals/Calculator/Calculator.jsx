import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Actions from "../../../constants/Actions.js";
import VariableList from "./VariableList.jsx";
import InputArea from "./InputArea.jsx";
import CalculatorButtons from "./CalculatorButtons.jsx";
import { BINARY_OPERATORS, UNARY_OPERATORS } from "../../../constants/Constants";
import "./Calculator.scss";

const CALC_TYPES = {
    var: "variable",
    const: "constant"
};

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_focus: false,
            new_variable_name: "",
            calculation_left_side: undefined,
            calculation_operator: undefined,
            calculation_right_side: undefined
        };
        this.handleNewVariableName = this.handleNewVariableName.bind(this);
        this.handleVariable = this.handleVariable.bind(this);
        this.handleConstant = this.handleConstant.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.printCalculation = this.printCalculation.bind(this);
        this.setInputFocus = this.setInputFocus.bind(this);
        this.isValidCalculation = this.isValidCalculation.bind(this);
        this.getOperand = this.getOperand.bind(this);
    }

    setInputFocus(state) {
        this.setState({ input_focus: state });
    }

    handleNewVariableName(event){
        this.setState({new_variable_name: event.target.value})
    }

    handleVariable(variable) {
        if (!this.state.calculation_left_side) {
            // Ex: ""
            this.setState({
                calculation_left_side: {
                    value: variable.name,
                    type: CALC_TYPES.var
                }
            });
        } else if (!this.state.calculation_operator) {
            // Ex: "u "
            toast.warning("Please select an operator before adding a second argument.", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (!BINARY_OPERATORS.includes(this.state.calculation_operator)) {
            // Ex: "regrid(x)"
            toast.warning("Cannot add a second argument to unary operator", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (!this.state.calculation_right_side) {
            // Ex: "u + "
            this.setState({
                calculation_right_side: {
                    value: variable.name,
                    type: CALC_TYPES.var
                }
            });
        } else {
            // Ex: "u + v"
            toast.warning("The calculator expression appears to be full. Try deleting an operand first.", { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    handleConstant(number) {
        if (!this.state.calculation_left_side) {
            // Ex: "" -> "1"
            this.setState({
                calculation_left_side: {
                    value: number,
                    type: CALC_TYPES.const
                }
            });
        } else if (this.state.calculation_left_side.type === CALC_TYPES.const && !this.state.calculation_operator) {
            // Ex: "2" -> "21"
            this.setState({
                calculation_left_side: {
                    value: this.state.calculation_left_side.value + "" + number,
                    type: CALC_TYPES.const
                }
            });
        } else if (this.state.calculation_left_side.type === CALC_TYPES.var && !this.state.calculation_operator) {
            toast.warning("Cannot append a number to a variable. Try selecting an operator first.", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (this.state.calculation_operator) {
            if (!BINARY_OPERATORS.includes(this.state.calculation_operator)) {
                toast.warning("Cannot add a second argument to unary operator", { position: toast.POSITION.BOTTOM_CENTER });
            } else if (!this.state.calculation_right_side) {
                this.setState({
                    calculation_right_side: {
                        value: number,
                        type: CALC_TYPES.const
                    }
                });
            } else if (this.state.calculation_right_side.type === CALC_TYPES.const) {
                this.setState({
                    calculation_right_side: {
                        value: this.state.calculation_right_side.value + "" + number,
                        type: CALC_TYPES.const
                    }
                });
            } else if (this.state.calculation_right_side.type === CALC_TYPES.var) {
                toast.warning("The calculator expression appears to be full. Try deleting an operand first.", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }
        }
    }

    handleClear() {
        this.setState({
            new_variable_name: "",
            calculation_left_side: undefined,
            calculation_operator: undefined,
            calculation_right_side: undefined
        });
    }

    handleDelete() {}

    handleEnter() {
        // send to vcs-js then clear
        if(this.isValidCalculation()){
            const left_value = this.getOperand(this.state.calculation_left_side);
            const right_value = this.getOperand(this.state.calculation_right_side);
            return vcs.calculate({
                left_value: left_value,
                op: this.state.calculation_operator,
                right_value: right_value
            }).then(json => {
                
            });
        }       
        else {
            toast.warning("Invalid Calculation", { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    handleOperator(operator) {
        if (this.state.calculation_operator) {
            toast.warning("There is already an operator selected.", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        } else if (UNARY_OPERATORS.includes(operator)) {
            this.setState({
                calculation_operator: operator
            });
        } else if (!this.state.calculation_left_side) {
            toast.warning("Binary operators require two operands. Please enter one first.", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        } else if (this.state.calculation_right_side) {
            toast.warning("The calculator expression appears to be full. Try deleting an operand first.", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        } else {
            this.setState({
                calculation_operator: operator
            });
        }
    }

    printCalculation() {
        const left = this.state.calculation_left_side ? this.state.calculation_left_side.value : "";
        const right = this.state.calculation_right_side ? this.state.calculation_right_side.value : "";
        const operator = this.state.calculation_operator ? this.state.calculation_operator : "";
        return `${left} ${operator} ${right}`;
    }

    isValidCalculation(){
        // Left value and an op must exist to be valid
        // If an op is binary, there must be a right side
        // Otherwise, if an op is unary, it can't have a right side
        const left = this.state.calculation_left_side
        const op = this.state.calculation_operator;
        const right = this.state.calculation_right_side
        if (left && op && ((BINARY_OPERATORS.includes(op) && right) || (UNARY_OPERATORS.includes(op) && !right))){
                return true
        } 
        return false
    }

    getOperand(obj){
        // Used to retrieve a properly formatted object that represents a variable.
        // The returned object should have the correct keys/values to be passed to vcs-js
        switch(obj.type){
            case CALC_TYPES.const:
                return {
                    type: obj.type,
                    value: obj.value,
                }
            case CALC_TYPES.var:
                if(this.props.variables[obj.value].json){
                    return {
                        type: obj.type,
                        json: this.props.variables[obj.value].json
                    }
                }else {
                    return {
                        type: obj.type,
                        path: this.props.variables[obj.value].path,
                        name: this.props.variables[obj.value].cdms_var_name
                    }
                }
            default:
                toast.error(`Invalid operand type "${obj.type}"`, { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    render() {
        const calculation_string = this.printCalculation();
        return (
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Calculator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main-container" onKeyPress={this.handleKeyPress}>
                        <VariableList variables={this.props.variable_names} removeVariable={this.props.removeVariable} />
                        <InputArea
                            new_variable_name={this.state.new_variable_name}
                            handleNewVariableName={this.handleNewVariableName}
                            calculation={calculation_string}
                            onDrop={this.handleVariable}
                            setFocus={this.setInputFocus}
                        />
                        <CalculatorButtons
                            handleConstant={this.handleConstant}
                            handleClear={this.handleClear}
                            handleDelete={this.handleDelete}
                            handleEnter={this.handleEnter}
                            handleOperator={this.handleOperator}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

Calculator.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    variables: PropTypes.object,
    variable_names: PropTypes.arrayOf(PropTypes.string),
    removeVariable: PropTypes.func
};

const mapStateToProps = state => {
    return {
        variable_names: state.present.variables ? Object.keys(state.present.variables) : [],
        variables: state.present.variables
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeVariable: name => dispatch(Actions.removeVariable(name)),
        loadVariable: (name, dimensions, transforms, json) => {
            dispatch(
                Actions.loadVariables([
                    {
                        name: name,
                        dimensions: dimensions,
                        transforms: transforms,
                        json: json
                    }
                ])
            );
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);
