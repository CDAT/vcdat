import React from 'react'
import Inspector from '../components/Inspector.jsx'
import Animation from '../components/Animation.jsx'

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
                <Inspector />
                <Animation />
            </div>
        )
    }
})

export default RightSideBar
