import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav.jsx';
import GraphicsMethodEditor from './modals/GraphicsMethodEditor.jsx';
import Tree from './Tree.jsx';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';
/* global $ */

//Drag and Drop integration; passed down to the Tree object
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


var el = null;
function siblingsVisible(element_name, parent_gm) {
    let first=$('#gm-list-'+parent_gm).children().children()[0]
    return $(first).css("display")==='list-item' ?true :false;
}
var GMList = React.createClass({
    propTypes: {
        graphicsMethods: React.PropTypes.object,
        updateGraphicsMethod: React.PropTypes.func,
        colormaps: React.PropTypes.object,
    },
    clickedEdit() {
        this.setState({showModal: true});
    },
    closedModal() {
        this.setState({showModal: false});
    },
    getInitialState() {
        return {
            activeGM: false,
            activeGMParent: false,
            showModal: false
        }
    },
    selectedChild(path) {
        if (path.length === 2) {
            let gm = path[1];
            let gm_parent = path[0];
            this.setState({
                activeGM: gm,
                activeGMParent: gm_parent,
            });
        }
    },
    render() {
        let gmEditor = "";
        const self = this;
        if (this.state && this.state.activeGM) {
            gmEditor = (
                <GraphicsMethodEditor colormaps={this.props.colormaps}
                                      graphicsMethod={this.props.graphicsMethods[this.state.activeGMParent][this.state.activeGM]}
                                      updateGraphicsMethod={this.props.updateGraphicsMethod}
                                      show={this.state.showModal}
                                      onHide={(e) => {self.closedModal();}} />
                );
        }

        const gmModel = Object.keys(this.props.graphicsMethods).map((gmType) => {
            const gms = Object.keys(this.props.graphicsMethods[gmType]).map((gmname) => {
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
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav editAction={this.clickedEdit} title='Graphics Methods'/>
                {gmEditor}
                <div className='scroll-area'>
                    <Tree dragSource={gmSource} dragCollect={collect} dragType={DragAndDropTypes.GM} contents={gmModel} activate={(activatePath) => {
                        self.selectedChild(activatePath);
                    }}/>
                </div>
            </div>
        )
    }
});

export default GMList;
