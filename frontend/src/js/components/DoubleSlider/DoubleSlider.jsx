import React, { Component } from 'react';
import style from './DoubleSlider.css';

class DoubleSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value1: props.value1 || 0,
            value2: props.value2 || 0,
        }
    }

    render() {
        return <section className="range-slider">
            <span className="rangeValues"></span>
            <input type="range" value={this.state.value1} onChange={() => this.setState({ value1: event.target.value })} />
            <input type="range" value={this.state.value2} onChange={() => this.setState({ value2: event.target.value })} />
        </section>
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate');
    }
}

export default DoubleSlider;


// function getVals() {
//     // Get slider values
//     var parent = this.parentNode;
//     var slides = parent.getElementsByTagName("input");
//     var slide1 = parseFloat(slides[0].value);
//     var slide2 = parseFloat(slides[1].value);
//     // Neither slider will clip the other, so make sure we determine which is larger
//     if (slide1 > slide2) { var tmp = slide2; slide2 = slide1; slide1 = tmp; }

//     var displayElement = parent.getElementsByClassName("rangeValues")[0];
//     displayElement.innerHTML = slide1 + " - " + slide2;
// }

// window.onload = function () {
//     // Initialize Sliders
//     var sliderSections = document.getElementsByClassName("range-slider");
//     for (var x = 0; x < sliderSections.length; x++) {
//         var sliders = sliderSections[x].getElementsByTagName("input");
//         for (var y = 0; y < sliders.length; y++) {
//             if (sliders[y].type === "range") {
//                 sliders[y].oninput = getVals;
//                 // Manually trigger event first time to display values
//                 sliders[y].oninput();
//             }
//         }
//     }
// }