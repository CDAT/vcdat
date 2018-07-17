import React from "react";
import PropTypes from "prop-types";

class CalculatorButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /* istanbul ignore next */
        return (
            /* prettier-ignore */
            <div className="calculator-buttons">
                <button id="regrid" className="calc-button advanced" onClick={() => {this.props.handleRegrid()}}>Regrid</button>
                <button id="power" className="calc-button advanced" onClick={() => {this.props.handleOperator("^")}}>x^y</button>
            
                <button id="unused" className="calc-button" disabled="disabled" />
                <button id="seven" className="calc-button numeric" onClick={() => {this.props.handleConstant(7)}}>7</button>
                <button id="eight" className="calc-button numeric" onClick={() => {this.props.handleConstant(8)}}>8</button>
                <button id="nine" className="calc-button numeric" onClick={() => {this.props.handleConstant(9)}}>9</button>
                <button id="divide" className="calc-button math" onClick={() => {this.props.handleOperator("/")}}>/</button>
            
                <button id="clear" className="calc-button save-clear" onClick={this.props.handleClear}>Clear</button>
                <button id="four" className="calc-button numeric" onClick={() => {this.props.handleConstant(4)}}>4</button>
                <button id="five" className="calc-button numeric" onClick={() => {this.props.handleConstant(5)}}>5</button>
                <button id="six" className="calc-button numeric" onClick={() => {this.props.handleConstant(6)}}>6</button>
                <button id="multiply" className="calc-button math" onClick={() => {this.props.handleOperator("*")}}>x</button>
            
                <button id="delete" className="calc-button save-clear" onClick={this.props.handleDelete}>Del</button>
                <button id="one" className="calc-button numeric" onClick={() => {this.props.handleConstant(1)}}>1</button>
                <button id="two" className="calc-button numeric" onClick={() => {this.props.handleConstant(2)}}>2</button>
                <button id="three" className="calc-button numeric" onClick={() => {this.props.handleConstant(3)}}>3</button>
                <button id="subtract" className="calc-button math" onClick={() => {this.props.handleOperator("-")}}>-</button>
            
                <button id="enter" className="calc-button save-clear" onClick={this.props.handleEnter}>Enter</button>
                <button id="zero" className="calc-button numeric" onClick={() => {this.props.handleConstant(0)}}>0</button>
                <button id="decimal" className="calc-button numeric" onClick={() => {this.props.handleDecimal()}}>.</button>
                <button id="plusminus" className="calc-button numeric" onClick={() => {this.props.handlePlusMinus()}}>+/-</button>
                <button id="add" className="calc-button math" onClick={() => {this.props.handleOperator("+")}}>+</button>
                
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
    handlePlusMinus: PropTypes.func,
    handleRegrid: PropTypes.func
};

export default CalculatorButtons;
