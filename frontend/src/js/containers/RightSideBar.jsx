import React from 'react'
import InspectorContainer from './InspectorContainer.jsx'
import Animation from '../components/Animation.jsx'
/* global $ */

var RightSideBar = React.createClass({
    componentDidMount(){
        $('#right-side-bar').resizable({
            ghost: true,
            handles: 'w',
            minWidth: 100,
            maxWidth:500,
        })
    },
    render(){
        return (
            <div id='right-side-bar'>
                <InspectorContainer />
                <Animation />
            </div>
        )
    }
})

export default RightSideBar
