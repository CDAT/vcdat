import React from 'react'
import TemplateLabelSettings from './TemplateLabelSettings.jsx'

const axis = ["xlabel1", "xlabel2", "ylabel1", "ylabel2", "xtic1", "xtic2", "ytic1", "ytic2", "ymintic1", "ymintic2"]


var TemplateAxisEditor = React.createClass({
    propTypes: {
        template: React.PropTypes.object,
        updateTemplate: React.PropTypes.func
    },
    updateTemplateAttribute(attribute) {
        const self = this;
        return (key, value) => {
            self.props.updateTemplate(attribute, key, value);
        }
    },
    getInitialState() {
        return {workingTemplate: $.extend({}, this.props.template)};
    },
    componentWillReceiveProps(nextProps) {
        this.setState({workingTemplate: $.extend({}, nextProps.template)});
    },
    render() {
        const template = this.state.workingTemplate;
        const self = this;
        return (
            <table className="table">
                <tbody>
                {axis.map((axis_name) => {
                    return <TemplateAxisSettings key={axis_name} label={template[axis_name]} update={self.updateTemplateAttribute(axis_name)} />
                })}
                </tbody>
            </table>
        );
    }
})

export default TemplateAxisEditor;
