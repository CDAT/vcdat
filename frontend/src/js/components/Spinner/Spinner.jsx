import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, FormControl, InputGroup } from 'react-bootstrap';
import './Spinner.scss';

class Spinner extends PureComponent {
    constructor(props){
        super(props)
        this.incrementValue = this.incrementValue.bind(this)
        this.decrementValue = this.decrementValue.bind(this)
    }

    incrementValue() {
        let value = this.props.value + 1;
        if (value <= this.props.max) {
            this.props.update(value)
        }
    }

    decrementValue() {
        let value = this.props.value -1 ;
        if (value >= this.props.min) {
            this.props.update(value)
        }
    }

    handleInputChange(value) {
        let new_value = Math.max(this.props.min, Math.min(this.props.max, value));
        this.props.update(new_value);
    }

    render() {
        return (
            <InputGroup bsSize="small" className="spinner">
                { this.props.addon_label ? <InputGroup.Addon>{this.props.addon_label}</InputGroup.Addon> : null }
                <FormControl type="number" value={this.props.value} onChange={(e) => {this.handleInputChange(e.target.value)}} />
                <InputGroup.Button>
                    <Button bsStyle="default" onClick={this.decrementValue}><Glyphicon glyph="menu-left" /></Button>
                    <Button bsStyle="default" onClick={this.incrementValue}><Glyphicon glyph="menu-right" /></Button>
                </InputGroup.Button>
            </InputGroup>
        )
    }
}

Spinner.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    update: PropTypes.func,
    value: PropTypes.number,
    addon_label: PropTypes.string,
}

export default Spinner;
