// import React from 'react'
var React = require('react')
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
// import GoldenLayout from 'golden-layout'
const GoldenLayout = require('imports?React=react&ReactDOM=react-dom!golden-layout')


var SpreadsheetContainer = React.createClass({
    getInitialState() {
        this.myLayout = null;
        return {};
    },
    componentDidMount() {
        var config = {
            content: [
                {
                    type: 'row',
                    content: [
                        {
                            type: 'react-component',
                            component: 'test-component',
                            props: {
                                label: 'A'
                            }
                        }, {
                            type: 'column',
                            content: [
                                {
                                    type: 'react-component',
                                    component: 'test-component',
                                    props: {
                                        label: 'B'
                                    }
                                }, {
                                    type: 'react-component',
                                    component: 'test-component',
                                    props: {
                                        label: 'C'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        this.myLayout = new GoldenLayout(config, document.getElementById('spreadsheet-div'));
        this.myLayout.registerComponent('test-component', Cell);
        window.addEventListener('resize', (ev) => {
            this.myLayout.updateSize();
        });
        this.myLayout.init();
    },
    render() {
        return (<div id='spreadsheet-div'/>)
    }
});

export default SpreadsheetContainer;
