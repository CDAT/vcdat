import React from 'react';
import TopBar from './TopBar/TopBar.jsx'
import LeftSideBar from './LeftSideBar.jsx';
import RightSideBar from './RightSideBar.jsx';
import SpreadsheetContainer from './SpreadsheetContainer/SpreadsheetContainer.jsx';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
/* global jQuery */

var AppContainer = React.createClass({
    propTypes: {
        undo: React.PropTypes.func,
        redo: React.PropTypes.func,
        undoEnabled: React.PropTypes.bool,
        redoEnabled: React.PropTypes.bool
    },
    render() {
        return (
            <div id='app-container'>
                <TopBar />
                <div id="main-container">
                    <LeftSideBar resizeSpreadsheet={this.resizeSpreadsheet} />
                    <SpreadsheetContainer />
                    <RightSideBar onUndo={this.props.undo} onRedo={this.props.redo} undoEnabled={this.props.undoEnabled} redoEnabled={this.props.redoEnabled}/>
                </div>
            </div>
        );
    }
});

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
