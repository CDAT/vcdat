import React from 'react'

var Missing = React.createClass({
    propTypes: {
        missing: React.PropTypes.number
    },
    getInitialState(){
        return {missing: this.props.missing}
    },
    onChange(event) {
        this.setState({missing: event.target.value})
    },
    render() {
        return (
                <td>Missing: <input type='number' value={this.state.missing} onChange={this.onChange}/></td>
        )
    }
});

export default Missing;
