import React from 'react'

var NOP = ()=>{}
var ColorOneTwo = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        colorOne: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        colorTwo: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    },
    render(){
        var that = this.props.that;
        return (
            <div>
                <h5>
                    Color 1:
                </h5>
                    <input type="number"
                        name="color_1"
                        defaultValue={this.props.colorOne}
                        onChange={NOP}
                        onBlur={this.props.handleChange} />
                <h5>Color 2:</h5>

                    <input type="number"
                        name="color_2"
                        defaultValue={this.props.colorTwo}
                        onChange={NOP}
                        onBlur={this.props.handleChange} />
            </div>
        );
    }
});

export default ColorOneTwo;
