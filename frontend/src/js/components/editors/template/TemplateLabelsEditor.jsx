import React from 'react'
import TemplateLabelSettings from './TemplateLabelSettings.jsx'

const labels = ["dataname", "title", "units", "mean", "min", "max", "file", "crdate", "crtime", "zname", "tname", "zvalue", "tvalue", "zunits", "tunits"]


var TemplateLabelsEditor = React.createClass({
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
                {labels.map((label_name) => {
                    return <TemplateLabelSettings key={label_name} label={template[label_name]} update={self.updateTemplateAttribute(label_name)} />
                })}
                </tbody>
            </table>
        );
    }
})

export default TemplateLabelsEditor;
