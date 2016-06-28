import React from 'react'

var Toolbar = React.createClass({
    render() {
        return (
            <div className='toolbar'>
                <button className='undo-redo-button' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <img src='/img/undo_icon.png'></img>
                </button>
                <button className='undo-redo-button' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <img src='/img/redo_icon.png'></img>
                </button>
            </div>
        )
    }
})

export default Toolbar;
