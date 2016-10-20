import React from 'react'
import { connect } from 'react-redux'

var Missing = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        missing: React.PropTypes.number,
        className: React.PropTypes.string
    },
    getInitialState() {
        return {
            missing: 0,
            mounted: false
        }
    },
    componentDidMount() {
        return {
            mounted: true
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            missing: nextProps.missing
        })
    },
    render() {
        var missing = this.state.missing
        var mounted = this.state.mounted
        return (
            <div className={this.props.className}>
                <h5>Missing: </h5>
                <input type='number'
                    name='missing'
                    value={missing? missing :mounted? undefined :0}
                    onChange={(event)=>{this.setState({missing:event.target.value})}}
                    onBlur={this.props.handleChange}/>
            </div>
        );
    }
});

export default Missing;
