import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PlotTools from '../components/PlotTools/PlotTools.jsx'

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
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    undoEnabled: PropTypes.bool,
    redoEnabled: PropTypes.bool,
}

export default RightSideBar
