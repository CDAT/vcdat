import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav/AddEditRemoveNav.jsx';
import TemplateEditor from './modals/TemplateEditor.jsx';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';
import {DragSource} from 'react-dnd';


// Use a simple function-based component, rather than a fancy class one.
function TemplateItem(props) {
    // This function is injected by the Dra
    return props.connectDragSource(
        <li className={props.active ? "active" : ""} onClick={(e) => {props.selectTemplate(props.template)}}>
            <a>{props.template}</a>
        </li>
    );
}

// Formats the data object passed to drop targets using the draggable component's props
const templateSource = {
    beginDrag(props) {
        return {
            template: props.template
        };
    }
};

// Assemble the functions and properties to inject into the TemplateItem
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

// Create a draggable version of the TemplateItem
const DraggableTemplateItem = DragSource(DragAndDropTypes.TMPL, templateSource, collect)(TemplateItem);


var TemplateList = React.createClass({
    propTypes: {
        templates: React.PropTypes.object,
        updateTemplate: React.PropTypes.func,
    },
    getInitialState(){
        return {"showTemplateEditor": false};
    },
    editTemplate() {
        this.setState({"showTemplateEditor": true});
    },
    updateTemplate(t) {
        this.setState({"showTemplateEditor": false});
        this.props.updateTemplate(t);
    },
    render() {
        let template = this.state.active_template ? this.props.templates[this.state.active_template] : this.props.templates.default;
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav
                    editAction={this.editTemplate}
                    addText="Adding templates is not supported yet"
                    editText="Edit a selected template"
                    removeText="Removing a template is not supported yet"
                    title='Templates'
                />
                <div className='scroll-area'>
                    <ul id='temp-list' className='no-bullets left-list'>
                        {Object.keys(this.props.templates).sort((a, b)=>{
                                return a.toLowerCase().localeCompare(b.toLowerCase());
                            }).map((value, index) => {
                                return (<DraggableTemplateItem template={value} key={index}
                                                           active={value === this.state.active_template}
                                                           selectTemplate={(t) => {this.setState({active_template: t});}} />);
                            })
                        }
                    </ul>
                </div>
                <TemplateEditor show={this.state.showTemplateEditor} template={template} updateTemplate={this.updateTemplate}/>
            </div>
        );
    }
});

export default TemplateList;
