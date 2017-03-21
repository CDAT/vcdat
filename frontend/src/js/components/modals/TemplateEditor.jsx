import React from 'react'
import {Modal, ButtonToolbar, Button} from 'react-bootstrap'
import widgets from 'vcs-widgets';


var TemplateEditor = React.createClass({
    propTypes: {
        template: React.PropTypes.object,
        updateTemplate: React.PropTypes.func,
    },
    onUpdate(attribute, key, value) {
        let new_templ = $.extend(true, {}, this.state.workingTemplate);
        new_templ[attribute][key] = value;
        this.setState({"workingTemplate": new_templ});
    },
    getInitialState() {
        return {workingTemplate: $.extend(true, {}, this.props.template)};
    },
    componentWillReceiveProps(nextProps) {
        this.setState({workingTemplate: $.extend(true, {}, nextProps.template)});
    },
    saveWorkingTemplate(){
        this.props.updateTemplate(this.state.workingTemplate);
    },
    onHide() {
        this.props.updateTemplate(this.props.template);
    },
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
                    <TemplateEdit templatePreview={"/plotTemplate?tmpl=" + JSON.stringify(template)} template={template} updateTemplate={this.onUpdate} />
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
})

export default TemplateEditor;
