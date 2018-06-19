import React from 'react';
import PropTypes from 'prop-types';

class CalculatorButtons extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="calculator-buttons">
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button" disabled="disabled" />
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(7)}}>7</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(8)}}>8</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(9)}}>9</button>
                    <button className="calc-button math" onClick={() => {this.props.handleOperator("+")}}>+</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear" onClick={this.props.handleClear}>Clear</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(4)}}>4</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(5)}}>5</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(6)}}>6</button>
                    <button className="calc-button math" onClick={() => {this.props.handleOperator("-")}}>-</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear" onClick={this.props.handleDelete}>Del</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(1)}}>1</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(2)}}>2</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(3)}}>3</button>
                    <button className="calc-button math" onClick={() => {this.props.handleOperator("*")}}>x</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear" onClick={this.props.handleEnter}>Enter</button>
                    <button className="calc-button numeric" onClick={() => {this.props.handleConstant(0)}}>0</button>
                    <button className="calc-button numeric">.</button>
                    <button className="calc-button numeric">+/-</button>
                    <button className="calc-button math" onClick={() => {this.props.handleOperator("/")}}>/</button>
                </div>
            </div>
        )
    }
}

CalculatorButtons.propTypes = {
    handleConstant: PropTypes.func,
    handleClear: PropTypes.func,
    handleDelete: PropTypes.func,
    handleEnter: PropTypes.func,
    handleOperator: PropTypes.func,
};

export default CalculatorButtons;