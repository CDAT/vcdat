import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'
import CachedFiles from './modals/CachedFiles.jsx'
import FileExplorer from './modals/FileExplorer.jsx'

var VarList = React.createClass({
    openDialog(){
        $('#cached-files').modal('show');
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Variables' addAction={this.openDialog} />
                <div className='scroll-area'>
                    <ul id='var-list' className='no-bullets left-list'>
                        {Object.keys(this.props.variables).map((value, index) => {
                            return (
                                <li key={value} className='main-left-list-item draggable-list-item' data-type='variable' data-name={value}>
                                    <a>{value}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <CachedFiles curVariables={this.props.variables} loadVariables={this.props.loadVariables} cachedFiles={this.props.cachedFiles} />
                <FileExplorer addFileToCache={this.props.addFileToCache}/>
            </div>
        )
    }
});

export default VarList;
