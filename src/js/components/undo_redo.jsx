import React from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

var UndoRedo = React.createClass({
    render() {
        return (
            <div className='row text-center black-text'>
                <button onClick={this.props.onUndo} disabled={!this.props.canUndo}>
                    Undo
                </button>
                <button onClick={this.props.onRedo} disabled={!this.props.canRedo}>
                    Redo
                </button>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    return {
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onUndo: () => dispatch(UndoActionCreators.undo()),
        onRedo: () => dispatch(UndoActionCreators.redo())
    }
}

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo)

export default UndoRedo
