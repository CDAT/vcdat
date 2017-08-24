import React, { Component } from 'react';
import Slider from 'bootstrap-slider';
import moment from 'moment';

import style from './DimensionSlider.scss';

import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';

class DimensionSlider extends Component {
    constructor(props) {
        super(props);
        this.slider = null;
        var type = 'number';
        var format = null;
        this.formatter = function (data) {
            if (data.toFixed) {
                return data.toFixed(5);
            }
            return data;
        }
        if (_.includes(props.units, 'since')) {
            type = 'date';
            var format;
            var increment;
            let [span, , startTime] = props.units.split(' ');
            switch (span) {
                case 'years':
                    format = 'YYYY';
                    break;
                case 'months':
                    format = 'YYYY-MM';
                    break;
                case 'days':
                    format = 'YYYY-MM-DD';
                    break;
                case 'hours':
                case 'minutes':
                    format = 'YYYY-MM-DD HH:mm';
                    break;
                case 'seconds':
                    format = 'YYYY-MM-DD HH:mm:ss';
                    break;
            }
            this.formatter = function (data) {
                return moment(startTime, 'YYYY-MM-DD').add(data, span).format(format);
            }
        }
        this.singleValue = props.data.length == 1;
        this.state = {
            min: 0,
            max: props.data.length - 1,
            value: [props.data[0], props.data[props.data.length - 1]]
        };
    }

    componentDidMount() {
        if (this.singleValue) {
            return;
        }
        this.slider = new Slider(this.input, {
            min: this.state.min,
            max: this.state.max,
            step: 1,
            value: [0, this.state.max],
            range: true,
            across: true,
            tooltip: 'hide',
            formatter: this.formatter
        }).on('slide', (sliderValues) => {
            var value = [this.props.data[sliderValues[0]], this.props.data[sliderValues[1]]];
            this.setState({ value });
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    }

    componentWillUnmount() {
        if (this.slider) {
            this.slider.destroy();
        }
    }

    // componentWillUpdate(nextProps, nextState) {
       
    // }

    render() {
        return (
            <div className="dimension-slider">
                {!this.singleValue &&
                    <div>
                        <span>({this.props.data.length}) {this.formatter(this.state.value[0])} : {this.formatter(this.state.value[1])}</span>
                        <input ref={input => this.input = input} />
                    </div>
                }
                {this.singleValue &&
                    <div>
                        <span>({this.props.data.length}) {this.formatter(this.state.value[0])}</span>
                    </div>}
            </div>
        )
    }
}

export default DimensionSlider;
