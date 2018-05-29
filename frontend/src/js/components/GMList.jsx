import React, { Component } from 'react'
import { connect } from 'react-redux'
import Actions from '../constants/Actions.js'
import PropTypes from 'prop-types'
import AddEditRemoveNav from './AddEditRemoveNav/AddEditRemoveNav.jsx'
import GraphicsMethodCreator from './modals/GraphicsMethodCreator.jsx'
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
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


class GMList extends Component {
    constructor(props){
        super(props)
        this.state = {
            activeGM: false,
            activeGMParent: false,
            show_edit_modal: false,
            show_create_modal: false,
        }
        this.clickedAdd = this.clickedAdd.bind(this)
        this.clickedEdit = this.clickedEdit.bind(this)
        this.clickedRemove= this.clickedRemove.bind(this)
        this.closeModal = this.closeEditModal.bind(this)
        this.selectedChild = this.selectedChild.bind(this)
    }

    clickedAdd() {
        this.setState({show_create_modal: true})
    }

    clickedEdit() {
        const gm = this.props.graphics_methods[this.state.activeGMParent][this.state.activeGM] 
        if (SUPPORTED_GM_EDITORS && !SUPPORTED_GM_EDITORS.includes(gm.g_name)) {
            toast.warn("This graphics method does not have an editor yet.", { position: toast.POSITION.BOTTOM_CENTER })
        }
        else {
            this.setState({show_edit_modal: true})
        }
    }

    clickedRemove() {
    }

    closeEditModal() {
        this.setState({show_edit_modal: false})
    }

    selectedChild(path) {
        if (path.length === 2) {
            let gm = path[1]
            let gm_parent = path[0]
            this.props.selectGraphicsMethod(gm_parent, gm)
        }
    }

    render() {
        const gmModel = Object.keys(this.props.graphics_methods).sort().map((gmType) => {
            const gms = Object.keys(this.props.graphics_methods[gmType]).sort().map((gmname) => {
                return {
                    'title': gmname,
                    'gmType': gmType
                }
            })

            return {
                'title': gmType,
                'contents': gms,
            }
        })

        return (
            <div className='left-side-list scroll-area-list-parent gm-list-container'>
                <AddEditRemoveNav 
                    title='Graphics Methods'
                    addAction={this.clickedAdd}
                    addText="Create a new Graphics Method"
                    editAction={this.clickedEdit}
                    editText="Edit a selected graphics method"
                    removeAction={this.clickedRemove}
                    removeText="Removing a graphics method is not supported yet"
                />
                {(this.props.selected_graphics_type &&
                    this.props.selected_graphics_method &&
                    this.props.graphics_methods[this.props.selected_graphics_type][this.props.selected_graphics_method]) ?
                        <GraphicsMethodEditor
                            colormaps={this.props.colormaps}
                            graphicsMethod={this.props.graphics_methods[this.state.activeGMParent][this.state.activeGM]}
                            updateGraphicsMethod={this.props.updateGraphicsMethod}
                            show={this.state.show_edit_modal}
                            onHide={this.closeEditModal}
                        />
                    :   
                        ""
                }
                <div className='scroll-area'>
                    <Tree
                        activeLeaf={this.props.selected_graphics_method}
                        activeParent={this.props.selected_graphics_type}
                        dragSource={gmSource}
                        dragCollect={collect}
                        dragType={DragAndDropTypes.GM}
                        contents={gmModel}
                        activate={(activatePath) => {
                            this.selectedChild(activatePath)
                        }}
                    />
                </div>
                { this.state.show_create_modal &&
                    <GraphicsMethodCreator
                        show={this.state.show_create_modal}
                        close={()=>{this.setState({show_create_modal: false})}}
                        graphics_methods={this.props.graphics_methods}
                        selectGM={this.props.selectGraphicsMethod}
                    />
                }
            </div>
        )
    }
}

GMList.propTypes = {
    graphics_methods: PropTypes.object,
    colormaps: PropTypes.object,
    updateGraphicsMethod: PropTypes.func,
    selectGraphicsMethod: PropTypes.func,
    selected_graphics_method: PropTypes.string,
    selected_graphics_type: PropTypes.string,
}

const mapStateToProps = (state) => {
    return {
        graphics_methods: state.present.graphics_methods,
        selected_graphics_method: state.present.ui.selected_graphics_method,
        selected_graphics_type: state.present.ui.selected_graphics_type,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateGraphicsMethod: (graphics_method) => {
            dispatch(Actions.updateGraphicsMethod(graphics_method))
        },
        selectGraphicsMethod: (type, method) => {
            dispatch(Actions.selectGraphicsMethod(type, method))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GMList)
