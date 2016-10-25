import React from 'react'

function verify(value) {
    if (typeof(value) === 'string') {
        if (value === '1e+20') {
            return Number.parseFloat(value)
        } else if(!value.match(/[\+-]{0,1}[0-9]+$/) || value === '') {
                return false;
        } else {
            return Number.parseInt(value);
        }
    } else {
        console.log( "level_(1|2) is not a string")
    }
}
var LevelOneTwo = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        level1: React.PropTypes.number,
        level2: React.PropTypes.number
    },
    getInitialState() {
        return {
            level1: '',
            level2: ''
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            level1: nextProps.level1,
            level2: nextProps.level2
        })
    },
    handleBlur(event) {
        let property_name = event.target.name
        let value = verify(event.target.value);
        if (value === 0 || value) {
            this.props.handleChange(property_name, value)
        } else {
            // indicate user entered wrong value
            console.log(property_name + " must be an integer or 1e+20");
            if (property_name === 'level_1') {
                this.setState({
                    level1: this.props.level1
                });
            } else {
                this.setState({
                    level2: this.props.level2
                });
            }
        }
    },
    render() {
        return (
            <div id='level-one-two'>
                <h5>
                    Level 1:
                </h5>

                    <input type="text"
                        name="level_1"
                        value={
                            this.state.level1 === 0 || this.state.level1
                            ? Number.isInteger(this.state.level1) && this.state.level1 === 1e20
                                ? this.state.level1.toExponential()
                                : this.state.level1
                            : ''
                        }
                        onChange={(event)=> {this.setState({level1:event.target.value})}}
                        onBlur={this.handleBlur}/>
                    <br/>
                <h5>
                    Level 2:
                </h5>

                    <input type="text"
                        name="level_2"
                        value={
                            this.state.level2 === 0 || this.state.level2
                            ? Number.isInteger(this.state.level2) && this.state.level2 === 1e20
                                ? this.state.level2.toExponential()
                                : this.state.level2
                            : ''
                        }
                        onChange={(event)=> {this.setState({level2:event.target.value})}}
                        onBlur={this.handleBlur}/>

            </div>
        );
    }
});

export default LevelOneTwo;
