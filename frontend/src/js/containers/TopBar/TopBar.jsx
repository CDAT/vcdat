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
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <p className="top-nav-header">Plot Inspector</p>
                    </div>
                </nav>
                <PlotInspectorWrapper />
            </div>
        )
    }
}

export default TopBar;

