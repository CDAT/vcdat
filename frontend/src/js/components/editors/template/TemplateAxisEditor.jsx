import React from 'react'
import {Tabs} from 'react-bootstrap'
import {Tab} from 'react-bootstrap'
import TemplateAxisSettingsX from './TemplateAxisSettingsX.jsx'
import TemplateAxisSettingsY from './TemplateAxisSettingsY.jsx'


const x1 = ["xlabel1", "xtic1", "xmintic1"];
const x2 = ["xlabel2", "xtic2", "xmintic2"];
const y1 = ["ylabel1", "ytic1", "ymintic1"];
const y2 = ["ylabel2", "ytic2", "ymintic2"];

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

        key: 1;
        return {workingTemplate: $.extend({}, this.props.template)};
    },
    componentWillReceiveProps(nextProps) {
        this.setState({workingTemplate: $.extend({}, nextProps.template)});
    },
    handleSelect(key) {
        this.setState({key});
    },
    render() {
        const template = this.state.workingTemplate;
        const self = this;
        return (
            <div>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="templateAxisEditors">
                    <Tab eventKey={1} title="First Set X">
                        {x1.map((axis_name) => {
                            return <TemplateAxisSettingsX key={axis_name} axis={template[axis_name]} page="1"
                                                          update={self.updateTemplateAttribute(axis_name)}/>
                        })}
                    </Tab>
                    <Tab eventKey={2} title="Second Set X">
                        {x2.map((axis_name) => {
                            return <TemplateAxisSettingsX key={axis_name} axis={template[axis_name]} page="2"
                                                          update={self.updateTemplateAttribute(axis_name)}/>
                        })}
                    </Tab>
                    <Tab eventKey={3} title="First Set Y">
                        {y1.map((axis_name) => {
                            return <TemplateAxisSettingsY key={axis_name} axis={template[axis_name]} page="3"
                                                          update={self.updateTemplateAttribute(axis_name)}/>
                        })}
                    </Tab>
                    <Tab eventKey={4} title="Second Set Y">
                        {y2.map((axis_name) => {
                            return <TemplateAxisSettingsY key={axis_name} axis={template[axis_name]} page="4"
                                                          update={self.updateTemplateAttribute(axis_name)}/>
                        })}
                    </Tab>
                </Tabs>
            </div>
        );
    }
})

export default TemplateAxisEditor;
