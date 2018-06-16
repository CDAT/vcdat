import React from 'react'

class CalculatorButtons extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="calculator-buttons">
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button" disabled="disabled" />
                    <button className="calc-button numeric">7</button>
                    <button className="calc-button numeric">8</button>
                    <button className="calc-button numeric">9</button>
                    <button className="calc-button math">+</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear">Clear</button>
                    <button className="calc-button numeric">4</button>
                    <button className="calc-button numeric">5</button>
                    <button className="calc-button numeric">6</button>
                    <button className="calc-button math">-</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear">Del</button>
                    <button className="calc-button numeric">1</button>
                    <button className="calc-button numeric">2</button>
                    <button className="calc-button numeric">3</button>
                    <button className="calc-button math">x</button>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <button className="calc-button save-clear">Enter</button>
                    <button className="calc-button numeric">0</button>
                    <button className="calc-button numeric">.</button>
                    <button className="calc-button numeric">+/-</button>
                    <button className="calc-button math">/</button>
                </div>
            </div>
        )
    }
}

export default CalculatorButtons