import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class CalculatorButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /* istanbul ignore next */
        return (
            <div id="calc-button-region" className="calculator-buttons">
                <div id="regrid" className="dropdown btn-group">
                    <button
                        type="button"
                        className="btn calc-button advanced"
                        onClick={() => {
                            this.props.handleOperator("regrid", { tool: "esmf", method: "linear" });
                        }}
                    >
                        Regrid
                    </button>
                    <button
                        type="button"
                        className="btn dropdown-toggle calc-button advanced"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <span className="caret" />
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a
                                onClick={() => {
                                    this.props.handleOperator("regrid", { tool: "esmf", method: "linear" });
                                }}
                            >
                                ESMF - Linear
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    this.props.handleOperator("regrid", { tool: "esmf", method: "conserve" });
                                }}
                            >
                                ESMF - Conserve
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    this.props.handleOperator("regrid", { tool: "esmf", method: "patch" });
                                }}
                            >
                                ESMF - Patch
                            </a>
                        </li>
                        <li role="separator" className="divider" />
                        <li>
                            <a
                                onClick={() => {
                                    this.props.handleOperator("regrid", { tool: "libcf" });
                                }}
                            >
                                LibCF - linear
                            </a>
                        </li>
                        <li role="separator" className="divider" />
                        <li>
                            <a
                                onClick={() => {
                                    this.props.handleOperator("regrid", { tool: "regrid2" });
                                }}
                            >
                                Regrid2 - old behavior
                            </a>
                        </li>
                    </ul>
                </div>
                <Button
                    id="power"
                    className="calc-button advanced"
                    onClick={() => {
                        this.props.handleOperator("**");
                    }}
                >
                    x<sup>y</sup>
                </Button>

                <Button id="unused" className="calc-button" disabled={true} />
                <Button
                    id="seven"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(7);
                    }}
                >
                    7
                </Button>
                <Button
                    id="eight"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(8);
                    }}
                >
                    8
                </Button>
                <Button
                    id="nine"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(9);
                    }}
                >
                    9
                </Button>
                <Button
                    id="divide"
                    className="calc-button math"
                    onClick={() => {
                        this.props.handleOperator("/");
                    }}
                >
                    /
                </Button>

                <Button id="clear" className="calc-button save-clear" onClick={this.props.handleClear}>
                    Clear
                </Button>
                <Button
                    id="four"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(4);
                    }}
                >
                    4
                </Button>
                <Button
                    id="five"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(5);
                    }}
                >
                    5
                </Button>
                <Button
                    id="six"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(6);
                    }}
                >
                    6
                </Button>
                <Button
                    id="multiply"
                    className="calc-button math"
                    onClick={() => {
                        this.props.handleOperator("*");
                    }}
                >
                    x
                </Button>

                <Button id="delete" className="calc-button save-clear" onClick={this.props.handleDelete}>
                    Del
                </Button>
                <Button
                    id="one"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(1);
                    }}
                >
                    1
                </Button>
                <Button
                    id="two"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(2);
                    }}
                >
                    2
                </Button>
                <Button
                    id="three"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(3);
                    }}
                >
                    3
                </Button>
                <Button
                    id="subtract"
                    className="calc-button math"
                    onClick={() => {
                        this.props.handleOperator("-");
                    }}
                >
                    -
                </Button>

                <Button id="enter" className="calc-button save-clear" onClick={this.props.handleEnter}>
                    Enter
                </Button>
                <Button
                    id="zero"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleConstant(0);
                    }}
                >
                    0
                </Button>
                <Button
                    id="decimal"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handleDecimal();
                    }}
                >
                    .
                </Button>
                <Button
                    id="plusminus"
                    className="calc-button numeric"
                    onClick={() => {
                        this.props.handlePlusMinus();
                    }}
                >
                    +/-
                </Button>
                <Button
                    id="add"
                    className="calc-button math"
                    onClick={() => {
                        this.props.handleOperator("+");
                    }}
                >
                    +
                </Button>
            </div>
        );
    }
}

CalculatorButtons.propTypes = {
    handleConstant: PropTypes.func,
    handleClear: PropTypes.func,
    handleDelete: PropTypes.func,
    handleEnter: PropTypes.func,
    handleOperator: PropTypes.func,
    handleDecimal: PropTypes.func,
    handlePlusMinus: PropTypes.func
};

export default CalculatorButtons;
