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
                    
                </div>
                
            </div>
        )
    }
}

PlotTools.propTypes = {
    
}
const mapStateToProps = (state) => {
    return {
        cell_selected: state.present.sheets_model.selected_cell_id 
    }
}

export default connect(mapStateToProps, null)(PlotTools)
