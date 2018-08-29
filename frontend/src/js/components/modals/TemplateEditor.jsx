import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import widgets from 'vcs-widgets'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../constants/PubSubEvents.js'
import { toast } from 'react-toastify'
import $ from "jquery";

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
            return vcs.settemplate(this.state.workingTemplate.name, this.state.workingTemplate).then(()=>{
                PubSub.publish(PubSubEvents.template_update, this.state.workingTemplate.name)
                this.props.close()
            },
            /* istanbul ignore next */
            (error) => {
                console.warn(error)
                toast.error("Unable to save template. Try closing and opening the editor again.", { position: toast.POSITION.BOTTOM_CENTER })
            })
        }
        /* istanbul ignore next */
        else{
            toast.error("Unable to save template. Try closing and opening the editor again.", { position: toast.POSITION.BOTTOM_CENTER })
        }
    }

    render() {
        const template_name = this.props.template && typeof this.props.template === "object" ? this.props.template.name : "";
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <div id='template-editor-main'>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {template_name} &nbsp;
                            <Button onClick={() => this.props.startTour(3)} className="help-button main-help btn btn-xs btn-default">
                                <i className="glyphicon glyphicon-question-sign" />Help
                            </Button>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.props.template === "loading" ? <div style={{display: "flex", justifyContent: "center"}}><span className="loading-spinner"></span></div>
                            : this.props.template === "error" ? <div id="template-load-error">Error retrieving template data. Try another template, or restart vCDAT. If the problem persists, please send an email to cdat-support@llnl.gov detailing the issue.</div>
                            : <TemplateEdit 
                                    id='test-12345'
                                    templatePreview={"/plotTemplate?tmpl=" + JSON.stringify(this.state.workingTemplate)}
                                    template={this.state.workingTemplate}
                                    updateTemplate={this.onUpdate}
                            />
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.saveTemplate} bsStyle="primary" disabled={this.props.template === "error"}>Save</Button>
                        <Button onClick={this.props.close} bsStyle="default">Cancel</Button>    
                    </Modal.Footer>
                </div>
            </Modal>
        );
    }
}

TemplateEditor.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    startTour: PropTypes.func,
    template: PropTypes.oneOfType([
        PropTypes.string, // valid states: "loading" or "error"
        PropTypes.object, // template is an object if loading was successfull
    ]),
}

export default TemplateEditor;
