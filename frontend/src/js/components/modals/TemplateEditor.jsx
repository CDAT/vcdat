import React from 'react'
import {Tabs} from 'react-bootstrap'
import {Tab} from 'react-bootstrap'
import TemplatePreview from '../TemplatePreview.jsx'
import TemplateLabelsEditor from '../editors/template/TemplateLabelsEditor.jsx'
import TemplateAxisEditor from '../editors/template/TemplateAxisEditor.jsx'


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
        key: 1;
        return {workingTemplate: $.extend(true, {}, this.props.template)};
    },
    handleSelect(key) {
        this.setState({key});
    },
    componentWillReceiveProps(nextProps) {
        this.setState({workingTemplate: $.extend(true, {}, nextProps.template)});
    },
    saveWorkingTemplate(){
        this.props.updateTemplate(this.state.workingTemplate);
        $("#template-editor").modal('hide');
    },
    resetWorkingTemplate(){
        this.setState({workingTemplate: $.extend(true, {}, this.props.template)});
        $("#template-editor").modal('hide');
    },
    render() {
        let template = this.state.workingTemplate;
        let template_name = template ? template.name : "";
        return (
            <div className="modal fade" id='template-editor'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">
                                Edit {template_name}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <TemplatePreview template={template} />

                            <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="templateEditors">
                                <Tab eventKey={1} title="Labels">
                                    <TemplateLabelsEditor template={template} updateTemplate={this.onUpdate}/>
                                </Tab>
                                <Tab eventKey={2} title="Axes">
                                    <TemplateAxisEditor template={template} updateTemplate={this.onUpdate}/>
                                </Tab>
                            </Tabs>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className='btn btn-secondary' onClick={(e) => this.resetWorkingTemplate()}>Cancel</button>
                            <button type="button" className="btn btn btn-primary" onClick={(e) => this.saveWorkingTemplate()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default TemplateEditor;
