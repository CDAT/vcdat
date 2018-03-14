import React, {Component} from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import PubSubEvents from './../../constants/PubSubEvents.js'
import ColormapEditor from "../modals/ColormapEditor/ColormapEditor.jsx"
import { toast } from 'react-toastify'
import './PlotTools.scss'
/* global $ */

class PlotTools extends Component{
    constructor(props){
        super(props)
        this.state = {
            showColormapEditor: false
        }
        this.handleClear = this.handleClear.bind(this)
    }

    handleClear(){
        if(this.props.cell_selected === "-1_-1_-1"){
            toast.info("A cell must be selected to clear", {position: toast.POSITION.BOTTOM_CENTER})
        }
        else{
            PubSub.publish(PubSubEvents.clear_canvas)
        }
    }

    render(){
        return (
            <div id="inspector-toolbar" className='scroll-area-list-parent right-side-list'>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <p className='side-nav-header'>Plot Tools</p>
                    </div>
                </nav>
                <div className='scroll-area'>
                    <button 
                        id="clear-canvas-button"
                        className="btn btn-default btn-sm material-icons-button"
                        onClick={() => { this.handleClear() }}
                        title="Clear selected plot">
                        <i className="material-icons" style={{color: "red"}}>clear</i>
                    </button>
                    <button 
                        id="open-colormap-editor-button"
                        className="btn btn-default btn-sm material-icons-button"
                        onClick={() => this.setState({showColormapEditor: true})}
                        title="Open the colormap editor">
                        <i className="material-icons" style={{color: "blue"}}>color_lens</i>
                    </button>
                    <button
                        className='btn btn-default btn-sm'
                        onClick={this.props.onUndo}
                        disabled={!this.props.undoEnabled}>
                        <i className='glyphicon glyphicon-share-alt icon-flipped'></i>
                    </button>
                    <button
                        className='btn btn-default btn-sm'
                        onClick={this.props.onRedo}
                        disabled={!this.props.redoEnabled}>
                        <i className='glyphicon glyphicon-share-alt'></i>
                    </button>
                </div>
                {this.state.showColormapEditor && 
                    <ColormapEditor show={this.state.showColormapEditor} close={() => this.setState({showColormapEditor: false})}/>
                }
            </div>
        )
    }
}

PlotTools.propTypes = {
    onUndo: React.PropTypes.func,
    onRedo: React.PropTypes.func,
    undoEnabled: React.PropTypes.bool,
    redoEnabled: React.PropTypes.bool,
    cell_selected: React.PropTypes.string,
}
const mapStateToProps = (state) => {
    return {
        cell_selected: state.present.sheets_model.selected_cell_id 
    }
}

export default connect(mapStateToProps, null)(PlotTools)
