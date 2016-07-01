import React from 'react'

var Toolbar = React.createClass({
    render() {
        return (
            <div className='toolbar'>
                <button className='btn undo-redo-button' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <i className='material-icons'>undo</i>
                </button>
                <button className='btn undo-redo-button' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <i className='material-icons'>redo</i>
                </button>
            </div>
        )
    }
})

export default Toolbar;
