import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, ButtonToolbar, Button } from 'react-bootstrap'
import widgets from 'vcs-widgets'
import { toast } from 'react-toastify'
/* globals $ */
const TemplateEdit = widgets.TemplateEdit

class TemplateEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            workingTemplate: undefined
        }
        this.onUpdate = this.onUpdate.bind(this)
        this.saveTemplate = this.saveTemplate.bind(this)
    }

    onUpdate(attribute, key, value) {
        let new_templ = $.extend(true, {}, this.state.workingTemplate);
        new_templ[attribute][key] = value;
        this.setState({workingTemplate: new_templ});
    }

    componentWillReceiveProps(nextProps) {
        if(typeof nextProps.template === "object"){
            this.setState({workingTemplate: $.extend(true, {}, nextProps.template)});
        }
        else{
            this.setState({workingTemplate: undefined})
        }
    }

    saveTemplate() {
        if(this.state.workingTemplate && this.state.workingTemplate.name){
            vcs.settemplate(this.state.workingTemplate.name, this.state.workingTemplate).then(()=>{
                this.props.close()
            },
            (error) => {
                console.warn(error)
                toast.error("Unable to save template. Try closing and opening the editor again.", { position: toast.POSITION.BOTTOM_CENTER })
            })
        }
        else{
            toast.error("Unable to save template. Try closing and opening the editor again.", { position: toast.POSITION.BOTTOM_CENTER })
        }
    }

    render() {
        const template_name = this.props.template && typeof this.props.template === "object" ? this.props.template.name : "";
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {template_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.props.template === "loading" ? <div>Spinner</div>
                        : this.props.template === "error" ? <div>error</div>
                        : <TemplateEdit 
                                templatePreview={"/plotTemplate?tmpl=" + JSON.stringify(this.state.workingTemplate)}
                                template={this.state.workingTemplate}
                                updateTemplate={this.onUpdate}
                          />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button onClick={this.props.close}>Cancel</Button>
                        <Button onClick={this.saveTemplate}>Save</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

TemplateEditor.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    template: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
}

export default TemplateEditor;
