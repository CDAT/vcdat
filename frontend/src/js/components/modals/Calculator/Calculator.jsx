import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import _ from "lodash";
import Actions from "../../../constants/Actions.js";
import VariableList from "./VariableList.jsx";
import InputArea from "./InputArea.jsx";
import CalculatorButtons from "./CalculatorButtons.jsx";
import { BINARY_OPERATORS, UNARY_OPERATORS } from "../../../constants/Constants";
import "./Calculator.scss";

export const CALC_TYPES = {
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
            calculation_right_side: undefined,
            arguments: undefined,
            placeholder_text: ""
        };
        this.handleNewVariableName = this.handleNewVariableName.bind(this);
        this.handleVariable = this.handleVariable.bind(this);
        this.handleConstant = this.handleConstant.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.printCalculation = this.printCalculation.bind(this);
        this.setInputFocus = this.setInputFocus.bind(this);
        this.isValidCalculation = this.isValidCalculation.bind(this);
        this.getOperand = this.getOperand.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handlePlusMinus = this.handlePlusMinus.bind(this);
    }

    setInputFocus(state) {
        this.setState({ input_focus: state });
    }

    handleNewVariableName(event) {
        this.setState({ new_variable_name: event.target.value });
    }

    handleVariable(variable) {
        if (!this.state.calculation_left_side) {
            // Ex: ""
            this.setState({
                calculation_left_side: {
                    value: variable.name,
                    type: CALC_TYPES.var
                },
                placeholder_text: this.getPlaceholderText(variable.name)
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
                },
                placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, variable.name)
            });
        } else {
            // Ex: "u + v"
            toast.warning("The calculator expression appears to be full. Try deleting an operand first.", { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    handleConstant(number) {
        number = number.toString();
        if (!this.state.calculation_left_side) {
            // Ex: "" -> "1"
            this.setState({
                calculation_left_side: {
                    value: number,
                    type: CALC_TYPES.const
                },
                placeholder_text: this.getPlaceholderText(number)
            });
        } else if (this.state.calculation_left_side.type === CALC_TYPES.const && !this.state.calculation_operator) {
            // Ex: "2" -> "21"
            const new_value = this.state.calculation_left_side.value + number;
            this.setState({
                calculation_left_side: {
                    value: new_value,
                    type: CALC_TYPES.const
                },
                placeholder_text: this.getPlaceholderText(new_value)
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
                    },
                    placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, number)
                });
            } else if (this.state.calculation_right_side.type === CALC_TYPES.const) {
                const new_value = this.state.calculation_right_side.value + number;
                this.setState({
                    calculation_right_side: {
                        value: new_value,
                        type: CALC_TYPES.const
                    },
                    placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, new_value)
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
            calculation_right_side: undefined,
            placeholder_text: ""
        });
    }

    handleDelete() {
        if (this.state.calculation_right_side) {
            if (this.state.calculation_right_side.type === CALC_TYPES.const) {
                let right = Object.assign({}, this.state.calculation_right_side);
                right.value = right.value.slice(0, right.value.length - 1);
                if (right.value.length === 0) {
                    this.setState({
                        calculation_right_side: undefined,
                        placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator)
                    });
                } else {
                    this.setState({
                        calculation_right_side: right,
                        placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, right)
                    });
                }
            } else {
                // calculation_right_side.type === CALC_TYPES.var
                this.setState({
                    calculation_right_side: undefined,
                    placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator)
                });
            }
        } else if (this.state.calculation_operator) {
            this.setState({
                calculation_operator: undefined,
                placeholder_text: this.getPlaceholderText(this.state.calculation_left_side)
            });
        } else if (this.state.calculation_left_side) {
            if (this.state.calculation_left_side.type === CALC_TYPES.const) {
                let left = Object.assign({}, this.state.calculation_left_side);
                left.value = left.value.slice(0, left.value.length - 1);
                if (left.value.length === 0) {
                    this.setState({
                        calculation_left_side: undefined,
                        placeholder_text: this.getPlaceholderText()
                    });
                } else {
                    this.setState({
                        calculation_left_side: left,
                        placeholder_text: this.getPlaceholderText(left)
                    });
                }
            } else {
                // calculation_left_side.type === CALC_TYPES.var
                this.setState({
                    calculation_left_side: undefined,
                    placeholder_text: this.getPlaceholderText()
                });
            }
        }
    }

    handleEnter() {
        // send to vcs-js then clear
        if (this.isValidCalculation()) {
            const left_value = this.getOperand(this.state.calculation_left_side);
            const right_value = this.getOperand(this.state.calculation_right_side);
            try {
                return vcs
                    .calculate({
                        left_value: left_value,
                        op: this.state.calculation_operator,
                        right_value: right_value,
                        args: this.state.arguments
                    })
                    .then(
                        json => {
                            const new_variable_name = this.state.new_variable_name ? this.state.new_variable_name : this.state.placeholder_text;
                            this.props.loadVariable(new_variable_name, [], [], json);
                            this.setState({
                                calculation_left_side: undefined,
                                calculation_operator: undefined,
                                calculation_right_side: undefined,
                                placeholder_text: this.getPlaceholderText()
                            });
                        },
                        error => {
                            console.warn(error);
                            try {
                                toast.error(error.message, { position: toast.POSITION.BOTTOM_CENTER });
                            } catch (e) {
                                toast.error("An unknown error occurred while trying to calculate a new variable. Check the console for details.", {
                                    position: toast.POSITION.BOTTOM_CENTER
                                });
                            }
                        }
                    );
            } catch (e) {
                console.warn(e);
                if (e instanceof ReferenceError) {
                    toast.error("VCS is not loaded. Try restarting vCDAT", { position: toast.POSITION.BOTTOM_CENTER });
                }
            }
        } else {
            toast.warning("Invalid Calculation", { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    handleOperator(operator, args) {
        if (this.state.calculation_operator) {
            toast.warning("There is already an operator selected.", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        } else if (UNARY_OPERATORS.includes(operator)) {
            this.setState({
                calculation_operator: operator,
                placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, operator),
                arguments: args
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
                calculation_operator: operator,
                placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, operator),
                arguments: args
            });
        }
    }

    printCalculation() {
        // first we make sure that we don't print 'undefined' accidentally
        let left = this.state.calculation_left_side ? this.state.calculation_left_side.value : "";
        let right = this.state.calculation_right_side ? this.state.calculation_right_side.value : "";
        let operator = this.state.calculation_operator ? this.state.calculation_operator : "";

        // regrid is printed differently than other operators thus far
        if (operator === "regrid") {
            return `${left}.regrid(${right})`;
        }

        operator = operator ? " " + operator : "";
        right = right ? " " + right : "";
        // Lastly, we print. To avoid having needless spaces we handle them above
        return `${left}${operator}${right}`;
    }

    isValidCalculation() {
        // Left value and an op must exist to be valid
        // If an op is binary, there must be a right side
        // Otherwise, if an op is unary, it can't have a right side
        const left = this.state.calculation_left_side;
        const op = this.state.calculation_operator;
        const right = this.state.calculation_right_side;
        if (left && op && ((BINARY_OPERATORS.includes(op) && right) || (UNARY_OPERATORS.includes(op) && !right))) {
            return true;
        }
        return false;
    }

    getOperand(obj) {
        // Used to retrieve a properly formatted object that represents a variable.
        // The returned object should have the correct keys/values to be passed to vcs-js
        let operand = undefined;
        let subRegion = {};
        switch (obj.type) {
            case CALC_TYPES.const:
                return {
                    type: obj.type,
                    value: obj.value
                };
            case CALC_TYPES.var:
                if (this.props.variables[obj.value].json) {
                    operand = {
                        type: obj.type,
                        json: this.props.variables[obj.value].json
                    };
                } else {
                    operand = {
                        type: obj.type,
                        path: this.props.variables[obj.value].path,
                        name: this.props.variables[obj.value].cdms_var_name
                    };
                }
                this.props.variables[obj.value].dimension.filter(dimension => dimension.values).forEach(dimension => {
                    subRegion[dimension.axisName] = dimension.values.range;
                });
                if (!_.isEmpty(subRegion)) {
                    operand["operations"] = [{ subRegion }];
                }
                if (!_.isEmpty(this.props.variables[obj.value].transforms)) {
                    if (!operand["operations"]) {
                        operand["operations"] = [];
                    }
                    operand["operations"].push({ transform: this.props.variables[obj.value].transforms });
                }
                return operand;
            default:
                toast.error(`Invalid operand type "${obj.type}"`, { position: toast.POSITION.BOTTOM_CENTER });
        }
    }

    getPlaceholderText(left, op, right) {
        let op_string;
        let increment = 0;
        switch (op) {
            case "/":
                op_string = "div";
                break;
            case "*":
                op_string = "mult";
                break;
            case "-":
                op_string = "minus";
                break;
            case "+":
                op_string = "plus";
                break;
            case "**":
                op_string = "power";
                break;
            case "regrid":
                op_string = "regrid";
                break;
            default:
                op_string = "";
        }
        let placeholder = "";
        do {
            if (left) {
                placeholder = left.value ? `${left.value}` : `${left}`;
            }
            if (op) {
                placeholder = `${placeholder}_${op_string}`;
            }
            if (right) {
                placeholder = right.value ? `${placeholder}_${right.value}` : `${placeholder}_${right}`;
            }
            if (increment) {
                placeholder = `${placeholder}_${increment}`;
            }
            increment++;
        } while (this.props.variable_names.includes(placeholder));
        return placeholder;
    }

    // Function to handle keyboard shortcuts for the calculator
    handleKeyDown(event) {
        if (!this.state.input_focus) {
            // If the user is entering a new variable name, dont change the calculation input
            let code = event.which;

            if (code === 8) {
                // backspace key
                this.handleDelete();
            } else if (code === 13) {
                // enter key
                this.handleEnter();
            } else if (code === 46) {
                // delete key
                this.handleClear();
            } else if (code === 190 || code === 110) {
                // period key
                this.handleDecimal();
            } else if (code === 107 || (code === 187 && event.shiftKey)) {
                // plus key
                this.handleOperator("+");
            } else if (code === 109 || code === 189) {
                // minus key
                this.handleOperator("-");
            } else if (code === 106 || (code === 56 && event.shiftKey)) {
                // multiply key
                this.handleOperator("*");
            } else if (code === 111 || code === 191) {
                // divide key
                this.handleOperator("/");
            } else if (code >= 48 && code <= 57) {
                const num = code - 48; // gives 0-9
                this.handleConstant(num);
            }
        }
    }

    handleDecimal() {
        if (!this.state.calculation_left_side) {
            // Ex: "" -> "0."
            const new_value = "0.";
            this.setState({
                calculation_left_side: {
                    value: new_value,
                    type: CALC_TYPES.const
                },
                placeholder_text: this.getPlaceholderText(new_value)
            });
        } else if (this.state.calculation_left_side.type === CALC_TYPES.const && !this.state.calculation_operator) {
            if (this.state.calculation_left_side.value.includes(".")) {
                // Ex: "2.2" -> "2.2"
                toast.warning("Cannot add a second decimal to a number.", { position: toast.POSITION.BOTTOM_CENTER });
            } else {
                // Ex: "2" -> "2."
                const new_value = this.state.calculation_left_side.value + ".";
                this.setState({
                    calculation_left_side: {
                        value: new_value,
                        type: CALC_TYPES.const
                    },
                    placeholder_text: this.getPlaceholderText(new_value)
                });
            }
        } else if (this.state.calculation_left_side.type === CALC_TYPES.var && !this.state.calculation_operator) {
            toast.warning("Cannot append a decimal to a variable. Try selecting an operator first.", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (this.state.calculation_operator) {
            if (!BINARY_OPERATORS.includes(this.state.calculation_operator)) {
                toast.warning("Cannot add a second argument to unary operator", { position: toast.POSITION.BOTTOM_CENTER });
            } else if (!this.state.calculation_right_side) {
                const new_value = "0.";
                this.setState({
                    calculation_right_side: {
                        value: new_value,
                        type: CALC_TYPES.const
                    },
                    placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, new_value)
                });
            } else if (this.state.calculation_right_side.type === CALC_TYPES.const) {
                if (this.state.calculation_right_side.value.includes(".")) {
                    toast.warning("Cannot add a second decimal to a number.", { position: toast.POSITION.BOTTOM_CENTER });
                } else {
                    const new_value = this.state.calculation_right_side.value + ".";
                    this.setState({
                        calculation_right_side: {
                            value: new_value,
                            type: CALC_TYPES.const
                        },
                        placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, new_value)
                    });
                }
            } else if (this.state.calculation_right_side.type === CALC_TYPES.var) {
                toast.warning("The calculator expression appears to be full. Try deleting an operand first.", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }
        }
    }

    handlePlusMinus() {
        if (!this.state.calculation_left_side) {
            // Ex: "" -> ""
            toast.warning("A number must be entered to change signs.", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (this.state.calculation_left_side.type === CALC_TYPES.const && !this.state.calculation_operator) {
            if (this.state.calculation_left_side.value.startsWith("-")) {
                // Ex: "-1" -> "1"
                const new_value = this.state.calculation_left_side.value.slice(1, this.state.calculation_left_side.value.length);
                this.setState({
                    calculation_left_side: {
                        value: new_value,
                        type: CALC_TYPES.const
                    },
                    placeholder_text: this.getPlaceholderText(new_value)
                });
            } else {
                // Ex: "1" -> "-1"
                const new_value = "-" + this.state.calculation_left_side.value;
                this.setState({
                    calculation_left_side: {
                        value: new_value,
                        type: CALC_TYPES.const
                    },
                    placeholder_text: this.getPlaceholderText(new_value)
                });
            }
        } else if (this.state.calculation_left_side.type === CALC_TYPES.var && !this.state.calculation_operator) {
            toast.warning(
                "Changing the sign of a variable is not supported in this manner. Use the 'subtract' operator with a single variable to do this.",
                { position: toast.POSITION.BOTTOM_CENTER }
            );
        } else if (this.state.calculation_operator) {
            if (!BINARY_OPERATORS.includes(this.state.calculation_operator)) {
                toast.warning("Cannot add a second argument to unary operator", { position: toast.POSITION.BOTTOM_CENTER });
            } else if (!this.state.calculation_right_side) {
                toast.warning("A number must be entered to change signs.", { position: toast.POSITION.BOTTOM_CENTER });
            } else if (this.state.calculation_right_side.type === CALC_TYPES.const) {
                if (this.state.calculation_right_side.value.startsWith("-")) {
                    // Ex: "-1" -> "1"
                    const new_value = this.state.calculation_right_side.value.slice(1, this.state.calculation_right_side.value.length);
                    this.setState({
                        calculation_right_side: {
                            value: new_value,
                            type: CALC_TYPES.const
                        },
                        placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, new_value)
                    });
                } else {
                    const new_value = "-" + this.state.calculation_right_side.value;
                    this.setState({
                        calculation_right_side: {
                            value: new_value,
                            type: CALC_TYPES.const
                        },
                        placeholder_text: this.getPlaceholderText(this.state.calculation_left_side, this.state.calculation_operator, new_value)
                    });
                }
            } else if (this.state.calculation_right_side.type === CALC_TYPES.var) {
                toast.warning(
                    "Changing the sign of a variable is not supported in this manner. Use the 'subtract' operator with a single variable to do this.",
                    { position: toast.POSITION.BOTTOM_CENTER }
                );
            }
        }
    }

    render() {
        const calculation_string = this.printCalculation();
        return (
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large" onKeyDown={this.handleKeyDown}>
                <Modal.Header closeButton>
                    <Modal.Title>Calculator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main-container">
                        <VariableList variables={this.props.variable_names} removeVariable={this.props.removeVariable} />
                        <div className="calc-right-side">
                            <InputArea
                                new_variable_name={this.state.new_variable_name}
                                handleNewVariableName={this.handleNewVariableName}
                                calculation={calculation_string}
                                onDrop={this.handleVariable}
                                setFocus={this.setInputFocus}
                                new_variable_placeholder={this.state.placeholder_text}
                            />
                            <CalculatorButtons
                                handleConstant={this.handleConstant}
                                handleClear={this.handleClear}
                                handleDelete={this.handleDelete}
                                handleEnter={this.handleEnter}
                                handleOperator={this.handleOperator}
                                handleDecimal={this.handleDecimal}
                                handlePlusMinus={this.handlePlusMinus}
                            />
                        </div>
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
    removeVariable: PropTypes.func,
    loadVariable: PropTypes.func
};

/* istanbul ignore next */
const mapStateToProps = state => {
    return {
        variable_names: state.present.variables ? Object.keys(state.present.variables) : [],
        variables: state.present.variables
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    return {
        removeVariable: name => dispatch(Actions.removeVariable(name)),
        loadVariable: (name, dimension, transforms, json) => {
            let var_obj = {};
            var_obj[name] = {
                dimension: dimension,
                transforms: transforms,
                json: json
            };
            dispatch(Actions.loadVariables([var_obj]));
        }
    };
};

export { Calculator as PureCalculator };
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);
