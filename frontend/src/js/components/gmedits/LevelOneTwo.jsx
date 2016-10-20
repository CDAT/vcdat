import React from 'react'

var NOP = ()=>{}
var LevelOneTwo = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        level1: React.PropTypes.number,
        level2: React.PropTypes.number
    },
    render() {
        return (
            <div id='level-one-two'>
                <h5>
                    Level 1:
                </h5>

                    <input type="text"
                        name="level_1"
                        defaultValue={
                            Number.isInteger(this.props.level1) && this.props.level1 > 1e4
                            ? this.props.level1.toExponential()
                            : this.props.level1
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/>
                    <br/>
                <h5>
                    Level 2:
                </h5>

                    <input type="text"
                        name="level_2"
                        defaultValue={
                            Number.isInteger(this.props.level2) && this.props.level2 > 1e4
                            ? this.props.level2.toExponential()
                            : this.props.level2
                        }
                        onChange={NOP}
                        onBlur={this.props.handleChange}/>

            </div>
        );
    }
});

export default LevelOneTwo;
