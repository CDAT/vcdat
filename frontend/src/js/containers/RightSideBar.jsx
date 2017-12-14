import React, {Component} from 'react'
import InspectorContainer from './InspectorContainer.jsx'
/* global $ */

class RightSideBar extends Component{

    render(){
        return (
            <div id='right-side-bar'>
                <InspectorContainer />
            </div>
        )
    }
}

export default RightSideBar
