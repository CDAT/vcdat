import React from 'react'

var Legend = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        legend: React.PropTypes.object,
        className: React.PropTypes.string
    },
    getInitialState() {
        return {
            legend: this.props.legend,
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            legend: nextProps.legend
        })
    },
    render() {
        return (
            <div className={this.props.className}>
                <h5>Legend Labels: </h5>
                    <input type='text'
                        name='legend'
                        value={this.state.legend ? this.state.legend: ''}
                        onChange={(event)=>{this.setState({legend:event.target.value})}}
                        onBlur={this.props.handleChange}/>
            </div>
        );
    }
});

export default Legend;
