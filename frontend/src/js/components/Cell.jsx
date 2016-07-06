import React from 'react'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'

var Cell = React.createClass({
    resizeCells(){
        $('.cell-image').each((index, el) => {
                el = $(el);
                var height = el.parent().innerHeight();
                el.height(height);
                var border = el.next();
                border.outerHeight(height);
            })
    },
    componentDidMount(){
        this.resizeCells();
        var element = $('.cell')[0];
        new ResizeSensor(element, () => {
            this.resizeCells();
        })
    },
    render(){
        return(
            <div className='cell'>
                <img className='cell-image' src='../../res/clt_image.png' alt='climate_data'></img>
                <div className='border'></div>
            </div>
        )
    }
});

export default Cell;
