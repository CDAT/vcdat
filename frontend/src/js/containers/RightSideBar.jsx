import React, {Component} from 'react'
import PlotTools from '../components/PlotTools/PlotTools.jsx'
/* global $ */

class RightSideBar extends Component{

    render(){
        return (
            <div id='right-side-bar'>
                <PlotTools {...this.props}/>
            </div>
        )
    }
}

RightSideBar.propTypes = {
    onUndo: React.PropTypes.func,
    onRedo: React.PropTypes.func,
    undoEnabled: React.PropTypes.bool,
    redoEnabled: React.PropTypes.bool,
}

export default RightSideBar
