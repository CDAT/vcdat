import React from 'react'
import { Modal, ButtonToolbar, Button, Row, Col, Glyphicon, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';
import './Spinner.scss';
/* global $*/

var Spinner = React.createClass({
    propTypes: {
        max: React.PropTypes.number,
        min: React.PropTypes.number,
        update: React.PropTypes.func,
        value: React.PropTypes.number
    },
    incrementValue() {
        let value = this.props.value + 1;
        if (value <= this.props.max) {
            this.props.update(value)
        }
    },
    decrementValue() {
        let value = this.props.value -1 ;
        if (value >= this.props.min) {
            this.props.update(value)
        }
    },
    handleInputChange(value) {
        var value = Math.max(this.props.min, Math.min(this.props.max, value));
        this.props.update(value);
    },
    render() {
        return (
            <InputGroup bsSize="small" className="spinner">
                <FormControl type="number" value={this.props.value} onChange={(e) => this.handleInputChange(e.target.value)} />
                <InputGroup.Button>
                    <Button bsStyle="default" onClick={this.decrementValue}><Glyphicon glyph="menu-left" /></Button>
                    <Button bsStyle="default" onClick={this.incrementValue}><Glyphicon glyph="menu-right" /></Button>
                </InputGroup.Button>
            </InputGroup>
        )
    }
});

export default Spinner;
