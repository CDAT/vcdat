import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ColormapEditor from './modals/ColormapEditor/ColormapEditor.jsx'

class Toolbar extends Component{
    constructor(props){
        super(props)
        this.state = {
            showColormapEditor: false
        }
    }

    render() {
        return (
            <div className='toolbar'>
                <button className='btn btn-default btn-sm' onClick={this.props.onUndo} disabled={!this.props.undoEnabled}>
                    <i className='glyphicon glyphicon-share-alt icon-flipped'></i>
                </button>
                <button className='btn btn-default btn-sm' onClick={this.props.onRedo} disabled={!this.props.redoEnabled}>
                    <i className='glyphicon glyphicon-share-alt'></i>
                </button>
                <Button bsStyle="primary" bsSize="small" onClick={() => this.setState({showColormapEditor: true})}>Colormap Editor</Button>
                <ColormapEditor show={this.state.showColormapEditor} close={() => this.setState({showColormapEditor: false})}/>
            </div>
        )
    }
}

Toolbar.propTypes = {
    onUndo: React.PropTypes.func,
    onRedo: React.PropTypes.func,
    undoEnabled: React.PropTypes.bool,
    redoEnabled: React.PropTypes.bool
}

export default Toolbar;
