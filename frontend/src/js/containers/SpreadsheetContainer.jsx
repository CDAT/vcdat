import React from 'react'
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'
const GoldenLayout = require('imports?React=react&ReactDOM=react-dom!golden-layout')

var SpreadsheetContainer = React.createClass({
    getInitialState() {
        this.layout = this.props.present.projects.layout;
        this.config = this.props.present.projects.config;
        return {};
    },
    setupSpreadsheet() {
        var div = document.getElementById('spreadsheet-div');
        //console.log('config', this.props.present.projects.config);
        console.log(this.config);
        this.layout = new GoldenLayout(this.config, div);
        this.layout.registerComponent('test-component', Cell);
        window.addEventListener('resize', (ev) => {
            this.layout.updateSize();
        });
        // this.myLayout.on('stackCreated', (state) => {
        //     console.log('stack created', state);
        //     this.props.updateConfig(state.config)
        //})
        console.log('initting');
        this.layout.init();
        this.props.layoutInitialized(this.layout);
    },
    componentDidMount() {
        this.setupSpreadsheet();
    },
    componentDidUpdate() {
        console.log('componentDidUpdate', this.layout);
        this.layout.init();
    },
    addSheet() {
        this.props.addItem({
            type: 'stack',
            title: 'New Sheet',
            content: [
                {
                    title: 'new_component',
                    type: 'react-component',
                    component: 'test-component'
                }
            ]

        })
    },
    render() {
        return (
            <div id='spreadsheet-div'>
                <button className='black' onClick={this.addSheet}>+</button>
                // {JSON.stringify(this.props.present.projects.config)}
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    console.log('mapping state', state);
    return state;
    // return {config: state.present.projects.config};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addItem: (item) => dispatch(Actions.addItem(item)),
        layoutInitialized: (layout) => dispatch(Actions.layoutInitialized(layout))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
