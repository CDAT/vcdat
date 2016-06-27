import React from 'react'

var Toolbar = React.createClass({
    render() {
        return (
            <div className='toolbar'>
                <button onClick={this.props.onUndo}>
                    <img src='/img/undo_icon.png'></img>
                </button>
                <button onClick={this.props.onRedo}>
                    <img src='/img/redo_icon.png'></img>
                </button>
            </div>
        )
    }
})

export default Toolbar;
