import React from 'react'
import PlotInspectorWrapper from '../../components/PlotInspector/PlotInspectorWrapper.jsx'
import './TopBar.scss'

class TopBar extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className="top-bar">
                <PlotInspectorWrapper />
            </div>
        )
    }
}

export default TopBar;

