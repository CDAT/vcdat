import React from 'react';
import Toolbar from '../components/Toolbar.jsx';
import LeftSideBar from './LeftSideBar.jsx';
import RightSideBar from './RightSideBar.jsx';
import SpreadsheetContainer from './SpreadsheetContainer.jsx';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import {ActionCreators as UndoActionCreators} from 'redux-undo';
import {connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
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
                <Toolbar
                    onUndo={this.props.undo}
                    onRedo={this.props.redo}
                    undoEnabled={this.props.undoEnabled}
                    redoEnabled={this.props.redoEnabled}
                />
                <div id='main-container'>
                    <LeftSideBar resizeSpreadsheet={this.resizeSpreadsheet}/>
                    <SpreadsheetContainer/>
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
