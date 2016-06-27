import React from 'react'

var Cell = React.createClass({
    componentDidMount(){
        var c = $('#' + this.props.id)[0];
        try{
            var ctx = c.getContext("2d");
        }catch(e){
            // console.log('error',e);
            return;
        }
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
