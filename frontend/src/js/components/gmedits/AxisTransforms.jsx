import React from 'react'

var AxisTransforms = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        converts: React.PropTypes.array,
        defaultX: React.PropTypes.string,
        defaultY: React.PropTypes.string
    },
    render(){
        var that = this.props.that
        return (
            <div>
                <h5>X axis transform: </h5>
                {
                    this.props.converts.map((convert) => {
                        return (
                                <span key={'xconvert'+Date.now()/Math.random()}>
                                    {
                                        convert === this.props.defaultX
                                        ? <input name='xaxisconvert'
                                            type='radio'
                                            value={convert}
                                            onChange={this.props.handleChange}
                                            defaultChecked/>
                                        : <input name='xaxisconvert'
                                            type='radio'
                                            value={convert}
                                            onChange={this.props.handleChange}/>
                                    }
                                    {convert}
                                  </span>
                        );
                    })
                }
                <h5>Y axis transform: </h5>
                {
                    this.props.converts.map((convert) => {
                        return (
                                <span key={'yconvert'+Date.now()/Math.random()}>
                                    {
                                        convert === this.props.defaultY
                                        ? <input name='yaxisconvert'
                                            type='radio'
                                            value={convert}
                                            onChange={this.props.handleChange}
                                            defaultChecked/>
                                        : <input name='yaxisconvert'
                                            type='radio'
                                            value={convert}
                                            onChange={this.props.handleChange}/>
                                    }
                                    {convert}
                                  </span>
                        );
                    })
                }
            </div>
        );
    }
});

export default AxisTransforms;
