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
            new_variable_name: "",
            calculation_left_side: undefined,
            calculation_operator: undefined,
            calculation_right_side: undefined
        };
        this.handleVariable = this.handleVariable.bind(this);
        this.handleConstant = this.handleConstant.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.printCalculation = this.printCalculation.bind(this);
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

    render() {
        const calculation_string = this.printCalculation();
        return (
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Calculator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main-container" onKeyPress={this.handleKeyPress}>
                        <VariableList variables={this.props.variables} removeVariable={this.props.removeVariable} />
                        <InputArea new_variable_name={this.state.new_variable_name} calculation={calculation_string} onDrop={this.handleVariable} />
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
    variables: PropTypes.arrayOf(PropTypes.string),
    removeVariable: PropTypes.func
};

const mapStateToProps = state => {
    return {
        variables: state.present.variables ? Object.keys(state.present.variables) : []
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeVariable: name => dispatch(Actions.removeVariable(name))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);
