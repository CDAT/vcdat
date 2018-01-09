import React, { Component } from 'react';
import Slider from 'bootstrap-slider';
import moment from 'moment';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import _ from 'lodash'

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
            value: [props.data[0], props.data[props.data.length - 1]],
            stride: 1
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
        }).on('change', (arg) => {
            var sliderValues = arg.newValue;
            var value = [this.props.data[sliderValues[0]], this.props.data[sliderValues[1]]];
            this.setState({ value });
        });
    }

    componentWillUnmount() {
        if (this.slider) {
            this.slider.destroy();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.value !== nextState.value) {
            this.slider.setValue([this.props.data.indexOf(nextState.value[0]), this.props.data.indexOf(nextState.value[1])]);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.value !== prevState.value || this.state.stride !== prevState.stride) {
            this.changed();
        }
    }

    changed() {
        if (this.props.onChange) {
            this.props.onChange({
                range: this.state.value,
                stride: this.state.stride
            });
        }
    }

    render() {
        return (
            <div className="dimension-slider">
                {!this.singleValue &&
                    <div className="form-inline">
                        <FormControl
                            id="dimension-slider-select-lower"
                            bsSize="sm"
                            componentClass="select"
                            onChange={(e) => {this.setState({ value: [parseInt(e.target.value), this.state.value[1]] })}}
                            value={this.state.value[0]}>
                            {this.props.data.map((data) => {
                                return <option key={data} value={data}>{this.formatter(data)}</option>;
                            })}
                        </FormControl>
                        &nbsp;:&nbsp;
                        <FormControl
                            id="dimension-slider-select-upper"
                            bsSize="sm"
                            componentClass="select"
                            onChange={(e) => this.setState({ value: [this.state.value[0], parseInt(e.target.value)] })}
                            value={this.state.value[1]}>
                            {this.props.data.map((data) => {
                                return <option key={data} value={data}>{this.formatter(data)}</option>;
                            })}
                        </FormControl>
                        <FormGroup
                            className="stride"
                            bsSize="sm">
                            <ControlLabel>stride:&nbsp;</ControlLabel>
                            <FormControl
                                type="number"
                                min="1"
                                step="1"
                                value={this.state.stride}
                                onChange={(e) => this.setState({ stride: parseInt(e.target.value) })} />
                        </FormGroup>
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
