import React, {Component} from 'react'
import PubSub from 'pubsub-js'
import PubSubEvents from './../constants/PubSubEvents.js'
import ColormapEditor from "./modals/ColormapEditor/ColormapEditor.jsx"
/* global $ */

class PlotTools extends Component{
    constructor(props){
        super(props)
        this.state = {
            showColormapEditor: false
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
                    <a id="clear-canvas-button" className="btn btn-default btn-xs" onClick={() => {PubSub.publish(PubSubEvents.clear_canvas)}} title="Clear selected plot">
                        <i className="material-icons" style={{color: "red"}}>clear</i>
                    </a>
                    <a id="open-colormap-editor-button" className="btn btn-default btn-xs" onClick={() => this.setState({showColormapEditor: true})} title="Open the colormap editor">
                        <i className="material-icons" style={{color: "blue"}}>color_lens</i>
                    </a>
                    <ColormapEditor show={this.state.showColormapEditor} close={() => this.setState({showColormapEditor: false})}/>
                </div>
            </div>
        )
    }
}

export default PlotTools
