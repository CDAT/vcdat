import React from 'react'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'

var Cell = React.createClass({
    resizeCells(){
        $('.cell-image').each((index, el) => {
                el = $(el);
                var height = el.parent().height();
                el.height(height);
                console.log('setting height', height);
                el.parent().find('.border').height(height);
            })
    },
    componentDidMount(){
        this.resizeCells();
        var element = $('.cell')[0];
        new ResizeSensor(element, () => {
            console.log('resizing');
            this.resizeCells();
        })
    },
    render(){
        return(
            // <div className='cell'></div>
            <div className='cell'>
                <img className='cell-image' src='../../res/clt_image.png' alt='climate_data'></img>
                <div className='border'></div>
            </div>
        )
    }
});

export default Cell;
