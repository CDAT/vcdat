import React from 'react'
import Toolbar from '../components/Toolbar.jsx'
import SpreadsheetContainer from './SpreadsheetContainer.jsx'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import {connect} from 'react-redux'

var AppContainer = React.createClass({
    render() {
        return (
            <div>
                <Toolbar onUndo={this.props.undo} onRedo={this.props.redo} undoEnabled={this.props.undoEnabled} redoEnabled={this.props.redoEnabled}/>
                <SpreadsheetContainer id='spreadsheet'/>
            </div>
        )
    }
})

const mapStateToProps = (state) => {
    var undoEnabled = state.past.length > 0;
    var redoEnabled = state.future.length > 0;
    return jQuery.extend({}, state.present, {undoEnabled: undoEnabled, redoEnabled: redoEnabled});
}

const mapDispatchToProps = (dispatch) => {
    return {
        undo: () => dispatch(UndoActionCreators.undo()),
        redo: () => dispatch(UndoActionCreators.redo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
