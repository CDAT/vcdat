import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'
import FileExplorer from './modals/FileExplorer.jsx'

var VarList = React.createClass({
    openDialog(){
        $('#file-explorer').modal('show');
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Variables' addAction={this.openDialog} />
                <div className='scroll-area'>
                    <ul id='var-list' className='no-bullets left-list'>
                        {this.props.variables.map((value, index) => {
                            return (
                                <li key={value} className='main-left-list-item draggable-list-item' data-type='variable' data-name={value}>
                                    <a>{value}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <FileExplorer />
            </div>
        )
    }
});

export default VarList;
