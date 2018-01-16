import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav.jsx';
import CachedFiles, { tabs } from './modals/CachedFiles/CachedFiles.jsx';
import { DragSource } from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';

var varSource = {
    beginDrag: function (props) {
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
        <li className={props.active ? "active" : ""} onClick={() => {props.selectVariable(props.variable)}}>
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
        ]),
        removeVariable: React.PropTypes.func,

    },
    getInitialState: function () {
        return { showFile: false };
    },
    editVariable: function() {
        if(this.state.active_variable){
            this.setState({ showFile: true, selectedTab: tabs.edit })
        }
        else{
            // notify the user somehow that a variable must be selected 
        }
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Variables'
                                  addAction={()=>this.setState({ showFile: true, selectedTab: tabs.file })} 
                                  editAction={()=>this.editVariable()}
                                  removeAction={()=>this.props.removeVariable(this.state.active_variable)}/>
                <div className='scroll-area'>
                    <ul id='var-list' className='no-bullets left-list'>
                        {Object.keys(this.props.variables).map((value, index) => {
                           return <DraggableVariable key={index} variable={value}
                                                     active={value === this.state.active_variable}
                                                     selectVariable={(v) => { this.setState({active_variable: v}) }}/>
                        })}
                    </ul>
                </div>
                <CachedFiles
                    show={this.state.showFile}
                    onTryClose={()=>this.setState({ showFile: false })}
                    curVariables={this.props.variables}
                    loadVariables={this.props.loadVariables}
                    cachedFiles={this.props.cachedFiles}
                    addFileToCache={this.props.addFileToCache}
                    selectedTab={this.state.selectedTab}
                    switchTab={(tab)=>this.setState({ selectedTab: tab})}
                />
            </div>
        )
    }
});

export default VarList;
