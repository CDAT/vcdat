import React from 'react'

function verify(value) {
    let new_value;
    if (typeof(value) === 'string') {
        if(value.match(/[^0-9]+/) || value === '') {
            return false;
        } else {
            new_value = Number.parseInt(value)
            if (new_value < 0 || new_value > 255) {
                return false;
            } else {
                return new_value;
            }
        }
    } else {
        console.log("color_(1|2) is not a string")
        console.log("color_(1|2) a "+typeof(value))
    }
}
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
    handleBlur(event) {
        let value = verify(event.target.value);
        let name = event.target.name
        if (value === 0 || value) {
            this.props.handleChange(name, value)
        } else {
            // indicate user entered wrong value and reset to last valid value
            console.log(name+" property must be an integer >= 0 and <=255. Value provided was " + event.target.value)
            if (name === 'color_1') {
                this.setState({
                    color1: this.props.color1
                });
            } else {
                this.setState({
                    color2: this.props.color2
                });
            }
        }
    },
    render(){
        return (
            <div>
                <h5>
                    Color 1:
                </h5>
                    <input type="number"
                        name="color_1"
                        value={this.state.color1===0 || this.state.color1 ?this.state.color1 :''}
                        onChange={(event)=> {this.setState({color1:event.target.value})}}
                        onBlur={this.handleBlur} />
                <h5>Color 2:</h5>

                    <input type="number"
                        name="color_2"
                        value={this.state.color2===0 || this.state.color2 ?this.state.color2 :''}
                        onChange={(event)=> {this.setState({color2:event.target.value})}}
                        onBlur={this.handleBlur} />
            </div>
        );
    }
});

export default ColorOneTwo;
