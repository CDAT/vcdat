import React from 'react'
import TemplatePreview from '../TemplatePreview.jsx'


var TemplateEditor = React.createClass({
    propTypes: {
        template: React.PropTypes.object
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
                    </div>
                </div>
            </div>
        )
    }
})

export default TemplateEditor;
