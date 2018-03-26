import React, { Component } from 'react';
import TopBar from './TopBar/TopBar.jsx'
import LeftSideBar from './LeftSideBar.jsx';
import SpreadsheetContainer from './SpreadsheetContainer/SpreadsheetContainer.jsx';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import { JOYRIDE_STEPS } from '../constants/Constants.js'
import Joyride from 'react-joyride'
import 'react-joyride/lib/react-joyride.scss'
/* global jQuery */

class AppContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            jr_steps: JOYRIDE_STEPS,
            jr_run: false,
            jr_auto_start: false,
        }
        this.startTour = this.startTour.bind(this)
    }

    componentDidMount(){
        
    }

    startTour(){
        if(this.joyride){
            this.setState({jr_run: true})
        }
    }

    render() {
        return (
            <div id='app-container'>
                <Joyride ref={(el)=>{this.joyride = el}}
                    steps={this.state.jr_steps}
                    run={this.state.jr_run}
                    autoStart={true}
                    type='continuous'
                />
                <TopBar
                    onUndo={this.props.undo}
                    onRedo={this.props.redo}
                    undoEnabled={this.props.undoEnabled}
                    redoEnabled={this.props.redoEnabled}
                    startTour={this.startTour}
                />
                <div id="main-container">
                    <LeftSideBar resizeSpreadsheet={this.resizeSpreadsheet} />
                    <SpreadsheetContainer />
                </div>
                <ToastContainer />
            </div>
        );
    }
}

AppContainer.propTypes = {
    undo: React.PropTypes.func,
    redo: React.PropTypes.func,
    undoEnabled: React.PropTypes.bool,
    redoEnabled: React.PropTypes.bool
}

const mapStateToProps = (state) => {
    var undoEnabled = state.past.length > 0;
    var redoEnabled = state.future.length > 0;
    return jQuery.extend({}, state.present, {
        undoEnabled: undoEnabled,
        redoEnabled: redoEnabled
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        undo: () => dispatch(UndoActionCreators.undo()),
        redo: () => dispatch(UndoActionCreators.redo())
    };
};

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(AppContainer));
