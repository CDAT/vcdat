import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddEditRemoveNav from './AddEditRemoveNav/AddEditRemoveNav.jsx'
import TemplateEditor from './modals/TemplateEditor.jsx'
import TemplateCreator from './modals/TemplateCreator.jsx'
import DragAndDropTypes from '../constants/DragAndDropTypes.js'
import Dialog from 'react-bootstrap-dialog'
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
            showTemplateCreator: false,
        }
        this.editTemplate = this.editTemplate.bind(this)
        this.removeTemplate = this.removeTemplate.bind(this)
        this.confirmRemove = this.confirmRemove.bind(this)
    }
    
    editTemplate() {
        if(this.props.selected_template === ""){
            toast.info("A template must be selected to edit", { position: toast.POSITION.BOTTOM_CENTER })
        }
        else{
            this.setState({showTemplateEditor: true, template_data: "loading"})
            vcs.gettemplate(this.props.selected_template).then((data)=>{
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

    confirmRemove() {
        if(this.props.selected_template === ""){
            toast.info("A template must be selected to delete", { position: toast.POSITION.BOTTOM_CENTER })
        }
        else{
            this.dialog.show({
                body: `Are you sure you want to delete ${this.props.selected_template}?`,
                actions: [
                    Dialog.DefaultAction(
                        'Remove',
                        () => {
                            this.removeTemplate()
                        },
                        'btn-danger'
                    ),
                    Dialog.CancelAction()
                ]
            })
        }
    }

    removeTemplate(){
        try{
            return vcs.removetemplate(this.props.selected_template).then(()=>{ // remove template from server
                this.props.removeTemplate(this.props.selected_template) // remove template from redux
                toast.success("Template removed successfully!", { position: toast.POSITION.BOTTOM_CENTER })
            },
            (error) => {
                try{
                    console.warn(error)
                    toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                }
                catch(e){
                    toast.error("A VCS error occurred when attempting to delete the template.", { position: toast.POSITION.BOTTOM_CENTER });        
                }
            })
        }
        catch(e) {
            console.warn(e)
            toast.error("Failed to delete template")
        }
    }

    render() {
        return (
            <div className='left-side-list scroll-area-list-parent template-list-container'>
                <AddEditRemoveNav
                    addText="Create a new template"
                    addAction={() => { this.setState({showTemplateCreator: true}) }}
                    editAction={this.editTemplate}
                    editText="Edit a selected template"
                    removeAction={this.confirmRemove}
                    removeText="Remove a template"
                    title='Templates'
                />
                <div className='scroll-area'>
                    <ul id='temp-list' className='no-bullets left-list'>
                        {this.props.templates.map((value, index) => {
                                return (
                                    <DraggableTemplateItem
                                        template={value}
                                        key={index}
                                        active={value === this.props.selected_template}
                                        selectTemplate={(t) => {
                                            this.props.selectTemplate(t)
                                        }}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                <TemplateEditor
                    show={this.state.showTemplateEditor}
                    close={() => this.setState({showTemplateEditor: false})}
                    template={this.state.template_data}
                />
                {
                    this.state.showTemplateCreator &&
                    <TemplateCreator
                        show={this.state.showTemplateCreator}
                        close={() => this.setState({showTemplateCreator: false})}
                        templates={this.props.templates}
                    />
                }  
                <Dialog ref={(el) => {this.dialog = el}} />
            </div>
        );
    }
}

TemplateList.propTypes = {
    templates: PropTypes.arrayOf(PropTypes.string),
    selected_template: PropTypes.string,
    selectTemplate: PropTypes.func,
    updateTemplate: PropTypes.func,
    removeTemplate: PropTypes.func,
}

export default TemplateList;
