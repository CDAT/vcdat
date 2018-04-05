import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap'
import widgets from 'vcs-widgets';
/* globals $ */

class TemplateEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            workingTemplate: $.extend(true, {}, this.props.template)
        }
        this.onUpdate = this.onUpdate.bind(this)
        this.saveWorkingTemplate = this.saveWorkingTemplate.bind(this)
        this.onHide = this.onHide.bind(this)
    }

    onUpdate(attribute, key, value) {
        let new_templ = $.extend(true, {}, this.state.workingTemplate);
        new_templ[attribute][key] = value;
        this.setState({"workingTemplate": new_templ});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({workingTemplate: $.extend(true, {}, nextProps.template)});
    }

    saveWorkingTemplate() {
        this.props.updateTemplate(this.state.workingTemplate);
    }

    onHide() {
        this.props.updateTemplate(this.props.template);
    }

    render() {
        let template = this.state.workingTemplate;
        let template_name = template ? template.name : "";
        let TemplateEdit = widgets.TemplateEdit;
        return (
            <Modal show={this.props.show} onHide={this.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {template_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TemplateEdit 
                        templatePreview={"/plotTemplate?tmpl=" + JSON.stringify(template)}
                        template={template}
                        updateTemplate={this.onUpdate} 
                    />
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button onClick={this.onHide}>Cancel</Button>
                        <Button onClick={this.saveWorkingTemplate}>Save</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

TemplateEditor.propTypes = {
    show: PropTypes.bool,
    template: PropTypes.object,
    updateTemplate: PropTypes.func,
}

export default TemplateEditor;
