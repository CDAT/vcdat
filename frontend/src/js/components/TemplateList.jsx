import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddEditRemoveNav from './AddEditRemoveNav/AddEditRemoveNav.jsx'
import TemplateEditor from './modals/TemplateEditor.jsx'
import DragAndDropTypes from '../constants/DragAndDropTypes.js'
import { DragSource } from 'react-dnd'
import { toast } from 'react-toastify'


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


class TemplateList extends Component {
    constructor(props){
        super(props)
        this.state = {
            showTemplateEditor: false,
            active_template: undefined,
        }
        this.editTemplate = this.editTemplate.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }
    
    editTemplate() {
        if(this.state.active_template === undefined){
            toast.info("A template must be selected to edit", { position: toast.POSITION.BOTTOM_CENTER })
        }
        else{
            this.setState({showTemplateEditor: true, template_data: "loading"})
            vcs.gettemplatedata(this.state.active_template).then((data)=>{
                this.setState({template_data: data})
            },
            (error) => {
                console.warn(error)
                toast.error("Failed to get template data. If this happens with other templates, try restarting vCDAT.",
                    { position: toast.POSITION.BOTTOM_CENTER }
                )
                this.setState({template_data: "error"})
            })
        }
    }

    handleClose(){
        this.setState({showTemplateEditor: false})
    }

    render() {
        return (
            <div className='left-side-list scroll-area-list-parent template-list-container'>
                <AddEditRemoveNav
                    editAction={this.editTemplate}
                    addText="Adding templates is not supported yet"
                    editText="Edit a selected template"
                    removeText="Removing a template is not supported yet"
                    title='Templates'
                />
                <div className='scroll-area'>
                    <ul id='temp-list' className='no-bullets left-list'>
                        {this.props.templates.map((value, index) => {
                                return (
                                    <DraggableTemplateItem
                                        template={value}
                                        key={index}
                                        active={value === this.state.active_template}
                                        selectTemplate={(t) => {
                                            this.setState({active_template: t})
                                        }}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                <TemplateEditor
                    show={this.state.showTemplateEditor}
                    close={this.handleClose}
                    template={this.state.template_data}
                />
            </div>
        );
    }
}
TemplateList.propTypes = {
    templates: PropTypes.arrayOf(PropTypes.string),
    updateTemplate: PropTypes.func,
}

export default TemplateList;
