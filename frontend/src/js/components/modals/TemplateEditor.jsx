import React from 'react'
import TemplatePreview from '../TemplatePreview.jsx'
import TemplateLabelsEditor from '../editors/template/TemplateLabelsEditor.jsx'


var TemplateEditor = React.createClass({
    propTypes: {
        template: React.PropTypes.object,
        updateTemplate: React.PropTypes.func,
    },
    onUpdate(attribute, key, value) {
        this.props.updateTemplate(this.props.template.name, attribute, key, value);
    },
    render() {
        let template = this.props.template;
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
                        <TemplatePreview template={template} />
                        <TemplateLabelsEditor template={template} updateTemplate={this.onUpdate}/>
                    </div>
                </div>
            </div>
        )
    }
})

export default TemplateEditor;
