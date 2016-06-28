import React from 'react'
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'
const GoldenLayout = require('imports?React=react&ReactDOM=react-dom!golden-layout')

var SpreadsheetContainer = React.createClass({
    getInitialState() {
        this.config = this.props.present.projects.config;
        return {};
    },
    setupSpreadsheet(update=true) {
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
        if(update){
            this.props.configUpdated(this.layout.toConfig);
        }
    },
    componentDidMount() {
        this.setupSpreadsheet();
    },
    componentDidUpdate() {
        console.log('componentDidUpdate', this.props.undo_redo);
        if (this.props.undo_redo){
            var lay = document.getElementsByClassName('lm_goldenlayout')[0];
            console.log(lay);
            lay.parentNode.removeChild(lay);
            this.setupSpreadsheet(false);
        }
    },
    addSheet() {
        this.layout.root.contentItems[0].addChild({
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
                {JSON.stringify(this.props.present.projects.config)}
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    console.log('mapping state', state);
    var undo_redo = false;
    if(state.future.length > 0){
        undo_redo = true;
    }
    return jQuery.extend({}, state, {undo_redo: undo_redo});
    // return {config: state.present.projects.config};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addItem: (item) => dispatch(Actions.addItem(item)),
        configUpdated: (config) => dispatch(Actions.configUpdated(config))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
