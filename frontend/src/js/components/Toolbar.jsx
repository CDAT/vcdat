import React from 'react'

var Toolbar = React.createClass({
    render() {
        return (
            <div className='toolbar'>
                <button className='btn btn-default' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <i className='glyphicon glyphicon-share-alt icon-flipped'></i>
                </button>
                <button className='btn btn-default ' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <i className='glyphicon glyphicon-share-alt'></i>
                </button>
            </div>
        )
    }
})

export default Toolbar;
