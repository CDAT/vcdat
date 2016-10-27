import React from 'react'

var NOP = ()=>{}
var DatawcCoordinates = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        x1: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        x2:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        y1: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        y2: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },
    render(){
        var that = this.props.that;
        return (
            <div>
                <h5> datawc_x1: </h5>
                    <input type="text"
                        name="datawc_x1"
                        defaultValue={
                            Number.isInteger(this.props.x1) && this.props.x1 > 1e4
                            ? this.props.x1.toExponential()
                            : this.props.x1
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/> <br/>
                    <h5>datawc_x2: </h5>
                    <input type="text"
                        name="datawc_x2"
                        defaultValue={
                            Number.isInteger(this.props.x2) && this.props.x2 > 1e4
                            ? this.props.x2.toExponential()
                            : this.props.x2
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/> <br/>

                    <h5>datawc_y1: </h5>
                    <input type="text"
                        name="datawc_y1"
                        defaultValue={
                            Number.isInteger(this.props.y1) && this.props.y1 > 1e4
                            ? this.props.y1.toExponential()
                            : this.props.y1
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/> <br/>
                    <h5>datawc_y2: </h5>
                    <input type="text"
                        name="datawc_y2"
                        defaultValue={
                            Number.isInteger(this.props.y2) && this.props.y2 > 1e4
                            ? this.props.y2.toExponential()
                            : this.props.y2
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/> <br/>
            </div>
        );
    }
});

export default DatawcCoordinates;
