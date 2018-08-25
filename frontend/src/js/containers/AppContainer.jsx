import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopBar from './TopBar/TopBar.jsx'
import LeftSideBar from './LeftSideBar.jsx'
import SpreadsheetContainer from './SpreadsheetContainer/SpreadsheetContainer.jsx'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { ToastContainer } from 'react-toastify'
import { JOYRIDE_STEPS, CALCULATOR_STEPS } from '../constants/Constants.js'
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
        this.handleJoyrideEvents = this.handleJoyrideEvents.bind(this)
    }

    componentDidMount(){
        
    }

    startTour(steps){
        if(this.joyride){
            var STEPS = {}
            switch(steps){
                case 0: STEPS = JOYRIDE_STEPS; break;
                case 1: STEPS = CALCULATOR_STEPS;
            }

            this.setState({jr_run: true, jr_steps: STEPS})
        }
    }

    handleJoyrideEvents(event){
        if(!event){
            console.warn("jr event was undefined")
            return
        }
        switch(event.type){
        case "step:after":
            if(event.action !== "close"){
                return // Only continue to reset on a close action
            }
            // falls through.
        case "overlay:click":
        case "finished":
            this.setState({jr_run: false},() => {
                this.joyride.reset(false) // pass .reset(false) so it does not start the tour again immediately
            })
            return
        case "error:target_not_found":
            console.warn("Joyride element missing on step ", event.index)
        }

    }

    render() {
        return (
            <div id='app-container'>
                <Joyride 
                    ref={(el)=>{this.joyride = el}}
                    steps={this.state.jr_steps}
                    run={this.state.jr_run}
                    autoStart={true}
                    type='continuous'
                    showSkipButton={true}
                    showStepsProgress={true}
                    scrollToSteps={false}
                    scrollToFirstStep={false}
                    holePadding={0}
                    locale={{ back: 'Back', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip' }}
                    callback={this.handleJoyrideEvents}
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
    undo: PropTypes.func,
    redo: PropTypes.func,
    undoEnabled: PropTypes.bool,
    redoEnabled: PropTypes.bool
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
