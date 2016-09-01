import React from 'react'
/* global $*/

var Spinner = React.createClass({
    propTypes: {
            max: React.PropTypes.string,
            min: React.PropTypes.string,
            update: React.PropTypes.func,
            value: React.PropTypes.number

    },
    incrementValue(event) {
        let input = $(this.refs.input);
        let value = parseInt(input.val(), 10) + 1;
        if (value <= parseInt(this.props.max, 10)) {
            input.val(value);
            this.props.update(value)
        }
    },
    decrementValue(event) {
        let input = $(this.refs.input);
        let value = parseInt(input.val(), 10) - 1;
        if (value >= parseInt(this.props.min, 10)) {
            input.val(value);
            this.props.update(value)
        }
    },
    render() {
        return (
            <div className="spinner">
                <input ref='input' type="text"
                    onChange={ (event) => {this.props.update(event.target.value)}}
                    value={this.props.value}
                />
                <div className="input-group-btn-vertical">
                    <button onClick={this.incrementValue} className="btn btn-default" type="button">
                        <i className="glyphicon glyphicon-chevron-up"></i>
                    </button>
                    <button onClick={this.decrementValue} className="btn btn-default" type="button">
                        <i className="glyphicon glyphicon-chevron-down"></i>
                    </button>
                </div>
            </div>
        )
    }
});

export default Spinner;
