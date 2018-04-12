import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddEditRemoveNav from './AddEditRemoveNav/AddEditRemoveNav.jsx'
import GraphicsMethodEditor from './modals/GraphicsMethodEditor.jsx'
import Tree from './Tree.jsx'
import DragAndDropTypes from '../constants/DragAndDropTypes.js'
import { SUPPORTED_GM_EDITORS } from 'vcs-widgets'
import { toast } from "react-toastify"

// Drag and Drop integration; passed down to the Tree object
var gmSource = {
    beginDrag: function(props) {
        return {
            'gmType': props.gmType,
            'gmName': props.title
        };
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}


class GMList extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeGM: false,
            activeGMParent: false,
            showModal: false
        }
        this.clickedEdit = this.clickedEdit.bind(this)
        this.closedModal = this.closedModal.bind(this)
        this.selectedChild = this.selectedChild.bind(this)
    }

    clickedEdit() {
        const gm = this.props.graphicsMethods[this.state.activeGMParent][this.state.activeGM] 
        if (SUPPORTED_GM_EDITORS && !SUPPORTED_GM_EDITORS.includes(gm.g_name)) {
            toast.warn("This graphics method does not have an editor yet.", { position: toast.POSITION.BOTTOM_CENTER })
        }
        else {
            this.setState({showModal: true});
        }
    }

    closedModal() {
        this.setState({showModal: false});
    }

    selectedChild(path) {
        if (path.length === 2) {
            let gm = path[1];
            let gm_parent = path[0];
            this.setState({
                activeGM: gm,
                activeGMParent: gm_parent,
            });
        }
    }

    render() {
        const gmModel = Object.keys(this.props.graphicsMethods).sort().map((gmType) => {
            const gms = Object.keys(this.props.graphicsMethods[gmType]).sort().map((gmname) => {
                return {
                    'title': gmname,
                    'gmType': gmType
                }
            });

            return {
                'title': gmType,
                'contents': gms,
            };
        });

        return (
            <div className='left-side-list scroll-area-list-parent gm-list-container'>
                <AddEditRemoveNav 
                    title='Graphics Methods'
                    editAction={this.clickedEdit}
                    addText="Creating a graphics method is not supported yet"
                    editText="Edit a selected graphics method"
                    removeText="Removing a graphics method is not supported yet"
                />
                {
                    (this.state && this.state.activeGM) ?
                        <GraphicsMethodEditor
                            colormaps={this.props.colormaps}
                            graphicsMethod={this.props.graphicsMethods[this.state.activeGMParent][this.state.activeGM]}
                            updateGraphicsMethod={this.props.updateGraphicsMethod}
                            show={this.state.showModal}
                            onHide={this.closedModal}
                        />
                    :   
                        ""
                }
                <div className='scroll-area'>
                    <Tree 
                        dragSource={gmSource}
                        dragCollect={collect}
                        dragType={DragAndDropTypes.GM}
                        contents={gmModel}
                        activate={(activatePath) => {
                            this.selectedChild(activatePath);
                        }}
                    />
                </div>
            </div>
        )
    }
}

GMList.propTypes = {
    graphicsMethods: PropTypes.object,
    updateGraphicsMethod: PropTypes.func,
    colormaps: PropTypes.object,
}

export default GMList;
