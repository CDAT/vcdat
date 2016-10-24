import React from 'react'

var ColorOneTwo = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        color1: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        color2: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    },
    getInitialState() {
        return {
            color1: '',
            color2: ''
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            color1: nextProps.color1,
            color2: nextProps.color2
        })
    },
    render(){
        return (
            <div>
                <h5>
                    Color 1:
                </h5>
                    <input type="number"
                        name="color_1"
                        value={this.state.color1 ?this.state.color1 :''}
                        onChange={(event)=> {this.setState({color1:event.target.value})}}
                        onBlur={this.props.handleChange} />
                <h5>Color 2:</h5>

                    <input type="number"
                        name="color_2"
                        value={this.state.color2 ?this.state.color2 :''}
                        onChange={(event)=> {this.setState({color2:event.target.value})}}
                        onBlur={this.props.handleChange} />
            </div>
        );
    }
});

export default ColorOneTwo;
