import React from 'react'

var Toolbar = React.createClass({
    render() {
        console.log('undo redo', this.props.undoEnabled, this.props.redoEnabled);
        return (
            <div className='toolbar'>
                <button className='btn undo-redo-button' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <img src='/img/undo_icon.png'></img>
                </button>
                <button className='btn undo-redo-button' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <img src='/img/redo_icon.png'></img>
                </button>
            </div>
        )
    }
})

export default Toolbar;
