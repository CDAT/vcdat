import React, { Component } from 'react';

class Toolbar extends Component{

    render() {
        return (
            <div className='toolbar'>
                <button className='btn btn-default btn-sm' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <i className='glyphicon glyphicon-share-alt icon-flipped'></i>
                </button>
                <button className='btn btn-default btn-sm' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <i className='glyphicon glyphicon-share-alt'></i>
                </button>
            </div>
        )
    }
}

Toolbar.propTypes = {
    onUndo: React.PropTypes.func,
    onRedo: React.PropTypes.func,
    undoEnabled: React.PropTypes.bool,
    redoEnabled: React.PropTypes.bool,
    clearCell: React.PropTypes.func,
}


export default Toolbar
