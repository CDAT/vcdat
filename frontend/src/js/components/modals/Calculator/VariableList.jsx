import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddEditRemoveNav from '../../AddEditRemoveNav/AddEditRemoveNav.jsx'
import { DragSource } from 'react-dnd'
import DragAndDropTypes from '../../../constants/DragAndDropTypes.js'
import { toast } from "react-toastify"

import './Calculator.scss'

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
        <li className={props.active ? "active" : ""} >
            <a>{props.variable}</a>
        </li>
    );
}

const DraggableVariable = DragSource(DragAndDropTypes.VAR, varSource, collect)(VariableItem);

class VarList extends Component {
    constructor(props){
        super(props)
        this.state = {
            showFile: false,
            showEdit: false
        }
        this.removeVariable = this.removeVariable.bind(this)
    }

    removeVariable() {
        this.props.removeVariable()
    }

    render() {
        return (
            <div className='left-side-list scroll-area-list-parent variable-list effect6'>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <p className='side-nav-header'>Variables</p>
                    </div>
                </nav>
                <div className='scroll-area'>
                    <ul id='calc-variable-list' className='no-bullets left-list'>
                        {this.props.variables.map((value) => {
                            return (
                                <DraggableVariable 
                                    key={value}
                                    variable={value}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

VarList.propTypes = {
    cachedFiles: PropTypes.object,
    loadVariables: PropTypes.func,
    variables: PropTypes.arrayOf(PropTypes.string),
    removeVariable: PropTypes.func,
}

export default VarList;
