/* global $ */
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
function focus(node_type, node_name) {
    let selector = node_type+"[name='"+node_name+"']"
    $(selector).focus()
}
function handleChange(event) {
    let i = Number.parseInt(event.target.name.split('_')[1]);
    let cur_value = event.target.value;
    let levels = this.state.levels;
    let first = levels.slice(0, i).concat(cur_value);
    let new_levels = first.concat(levels.slice((i + 1), levels.length));
    this.setState({
        levels: first.concat(levels.slice((i + 1), levels.length))
    })
}
var Levels = React.createClass({
    propTypes: {
        addLevel: React.PropTypes.func,
        removeLevel: React.PropTypes.func,
        handleChange: React.PropTypes.func,
        levels: React.PropTypes.array
    },
    getInitialState() {
        return {
            levels: [],
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            levels: nextProps.levels
        })
    },
    handleBlur(event) {
        let property_name = event.target.name.split('_')[0];
        let index = event.target.name.split('_')[1];
        let value = verify(event.target.value);
        if (value === 0 || value) {
            this.props.handleChange(property_name, value, index)
        } else {
            // indicate user entered wrong value
            console.log(property_name + " must be an integer or 1e+20");
            this.setState({
                levels: this.props.levels
            });
        }
    },
    render(){
        return (
            <div >
                <h5>Levels: </h5>
                {
                    this.state.levels && this.state.levels.length > 0
                    ? this.state.levels.map((value, index) => {
                        return (
                            <div key={'levels_'+index}>
                                <input name={'levels_'+index}
                                    type="text"
                                    value={
                                        Number.isInteger(value) && value > 1e4
                                        ? value.toExponential()
                                        : value
                                    }
                                    onChange={handleChange.bind(this)}
                                    onBlur={this.handleBlur}/>
                                <button onClick={this.props.removeLevel}
                                    data-index={index}
                                    className='btn btn-secondary'>
                                            -
                                </button><br/>
                                {
                                    index === (this.state.levels.length - 1)
                                    ? <button onClick={this.props.addLevel}
                                        className='btn btn-secondary'>
                                        +
                                      </button>
                                    : ''
                                }
                            </div>
                        );
                     })
                    : <button onClick={this.props.addLevel} className='btn btn-secondary'> + </button>

                }
            </div>
        );
    }
});

export default Levels;
