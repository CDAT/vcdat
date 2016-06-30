import React from 'react'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'

var Cell = React.createClass({
    componentDidMount(){
        var element = $('.cell')[0];
        new ResizeSensor(element, () => {
            console.log('resized');
            $('.cell-image').each((index, el) => {
                el = $(el);
                el.height(el.parent().height());
            })
        })
    },
    render(){
        console.log(ResizeSensor);
        return(
            // <div className='cell'></div>
            <div className='cell'>
                <img className='cell-image' src='http://www.nasa.gov/sites/default/files/thumbnails/image/15-115.jpg' alt='climate_data'></img>
            </div>
        )
    }
});

export default Cell;
