import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

import "./Calculator.scss";

class Calculator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Calculator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main-container">
                        <div className="variable-list">
                            <span>Variables</span>
                            {this.props.variables.map(variable => {
                                return <span style={{ display: "block" }}>{variable}</span>;
                            })}
                        </div>
                        <div className="operation-list">
                            <span>Operations</span>
                            <span> Load u</span>
                            <span> Load v</span>
                            <span> u2 = u / 2</span>
                            <span> v2 = v / 2</span>
                            <span> u2_v2 = u + v</span>
                        </div>
                        <div className="input-container" style={{ display: "flex", justifyContent: "center" }}>
                            <div className="input-wrapper">
                                <input type="text" /> = <input type="text" disabled />
                            </div>
                        </div>
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
                                <button className="calc-button math">*</button>
                            </div>
                            <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                <button className="calc-button save-clear">Enter</button>
                                <button className="calc-button numeric">0</button>
                                <button className="calc-button numeric">.</button>
                                <button className="calc-button numeric">+/-</button>
                                <button className="calc-button math">/</button>
                            </div>
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
    variables: PropTypes.oneOfType([PropTypes.array])
};

const mapStateToProps = state => {
    return {
        variables: state.present.variables ? Object.keys(state.present.variables) : []
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);
