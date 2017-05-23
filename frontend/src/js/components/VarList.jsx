import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav.jsx';
import CachedFiles from './modals/CachedFiles.jsx';
import FileExplorer from './modals/FileExplorer.jsx';
import {DragSource} from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';


var varSource = {
    beginDrag: function(props) {
        return {
            'variable': props.variable,
        };
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}


function VariableItem(props) {
    return props.connectDragSource(
        <li>
            <a>{props.variable}</a>
        </li>
    );
}

const DraggableVariable = DragSource(DragAndDropTypes.VAR, varSource, collect)(VariableItem);

var VarList = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func,
        cachedFiles: React.PropTypes.object,
        loadVariables: React.PropTypes.func,
        variables: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])

    },
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
                           return <DraggableVariable key={index} variable={value} />
                        })};
                    </ul>
                </div>
                <CachedFiles
                    curVariables={this.props.variables}
                    loadVariables={this.props.loadVariables}
                    cachedFiles={this.props.cachedFiles}
                />
                <FileExplorer addFileToCache={this.props.addFileToCache}/>
            </div>
        )
    }
});

export default VarList;
