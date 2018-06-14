import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './Calculator.scss'

class Calculator extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Calculator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={3} style={{borderColor: "red"}}>
                            <div style={{display: "flex", flexDirection: "column", borderRight: "red 1px solid"}}>
                                <div className="well">
                                    <span>Variables</span>
                                    { this.props.variables.map((variable) => {
                                            return <span style={{display: "block"}}>{variable}</span>
                                        })
                                    }
                                </div>
                                <div className="well">
                                    <span>Operations</span>
                                    <span> Load u</span>
                                    <span> Load v</span>
                                    <span> u2 = u / 2</span>
                                    <span> v2 = v / 2</span>
                                    <span> u2_v2 = u + v</span>
                                </div>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div className="input-container" style={{display: "flex", justifyContent: "center"}}>
                                    <input type="text"/> = <input type="text" disabled/>
                                </div>
                                <div style={{display: "flex", flexWrap: "nowrap"}}>
                                    <button className="calc-button" style={{}} disabled="disabled"></button>
                                    <button className="calc-button numeric" style={{}}>7</button>
                                    <button className="calc-button numeric" style={{}}>8</button>
                                    <button className="calc-button numeric" style={{}}>9</button>
                                    <button className="calc-button math" style={{}}>+</button>
                                </div>
                                <div style={{display: "flex", flexWrap: "nowrap"}}>
                                    <button className="calc-button save-clear" style={{}}>Clear</button>
                                    <button className="calc-button numeric" style={{}}>4</button>
                                    <button className="calc-button numeric" style={{}}>5</button>
                                    <button className="calc-button numeric" style={{}}>6</button>
                                    <button className="calc-button math" style={{}}>-</button>
                                </div>
                                <div style={{display: "flex", flexWrap: "nowrap"}}>
                                    <button className="calc-button save-clear" style={{}}>Del</button>
                                    <button className="calc-button numeric" style={{}}>1</button>
                                    <button className="calc-button numeric" style={{}}>2</button>
                                    <button className="calc-button numeric" style={{}}>3</button>
                                    <button className="calc-button math" style={{}}>*</button>
                                </div>
                                <div style={{display: "flex", flexWrap: "nowrap"}}>
                                    <button className="calc-button save-clear" style={{}}>Enter</button>
                                    <button className="calc-button numeric" style={{}}>0</button>
                                    <button className="calc-button numeric" style={{}}>.</button>
                                    <button className="calc-button numeric" style={{}}>+/-</button>
                                    <button className="calc-button math" style={{}}>/</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

Calculator.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    variables: PropTypes.oneOfType([
        PropTypes.array,
    ]),
}

const mapStateToProps = (state) => {
    return {
        variables: state.present.variables ? Object.keys(state.present.variables) : [],
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calculator)