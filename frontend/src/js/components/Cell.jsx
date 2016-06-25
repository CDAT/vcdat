import React from 'react'

var Cell = React.createClass({
    componentDidMount(){
        var c = $('#' + this.props.id)[0];
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(95,50,40,0,2*Math.PI);
        ctx.stroke();
    },
    render(){
        return(
          <canvas id={this.props.id}></canvas>
        )
    }
});

export default Cell;
