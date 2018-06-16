import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Actions from '../../../constants/Actions.js'
import VariableList from './VariableList.jsx'
import InputArea from './InputArea.jsx'
import CalculatorButtons from './CalculatorButtons.jsx'

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
                        <VariableList 
                            variables={this.props.variables}
                            removeVariable={this.props.removeVariable}
                        />
                        <InputArea />
                        <CalculatorButtons />
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
    removeVariable: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        variables: state.present.variables ? Object.keys(state.present.variables) : []
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeVariable: (name) => dispatch(Actions.removeVariable(name))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);
