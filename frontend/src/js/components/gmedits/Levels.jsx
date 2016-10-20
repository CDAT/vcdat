import React from 'react'

var NOP = ()=>{}
var Levels = React.createClass({
    propTypes: {
        addLevel: React.PropTypes.func,
        removeLevel: React.PropTypes.func,
        handleChange: React.PropTypes.func,
        levels: React.PropTypes.array
    },
    render(){
        return (
            <div >
                <h5>Levels: </h5>
                {
                    this.props.levels.length > 0
                    ? this.props.levels.map((value, index) => {
                        return (
                            <div key={'levels_'+index+(Date.now()/Math.random())}>
                                <input name={'levels_'+index}
                                    type="text"
                                    defaultValue={
                                        Number.isInteger(value) && value > 1e4
                                        ? value.toExponential()
                                        : value
                                    }
                                    onChange={NOP}
                                    onBlur={this.props.handleChange}/>
                                <button onClick={this.props.removeLevel}
                                    data-index={index}
                                    className='btn btn-secondary'>
                                            -
                                </button><br/>
                                {
                                    index === (this.props.levels.length - 1)
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
