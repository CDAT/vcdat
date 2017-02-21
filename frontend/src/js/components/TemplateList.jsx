import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'
import TemplateEditor from './modals/TemplateEditor.jsx'
/* global $ */

var el = null;

var TemplateList = React.createClass({
    propTypes: {
        templates: React.PropTypes.object,
        updateTemplate: React.PropTypes.func,
    },
    getInitialState(){
        return {};
    },
    selectedChild(val) {
        if (el !== null) {
            el.removeClass('bg-primary');
        }
        el = $(val.currentTarget);
        while (el.prop("tagName").toLowerCase() !== "li") {
            el = el.parent();
        }
        el.addClass('bg-primary')
        this.setState({
            active_template: el.attr("data-name")
        });
    },
    editTemplate() {
        $('#template-editor').modal('show')
    },
    render() {
        let template = this.state.active_template ? this.props.templates[this.state.active_template] : this.props.templates.default;
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav editAction={this.editTemplate} title='Templates'/>
                <div className='scroll-area'>
                    <ul id='temp-list' className='no-bullets left-list'>
                        {Object.keys(this.props.templates).map((value, index) => {
                            let class_name = 'main-left-list-item draggable-list-item';
                            return (
                                <li key={value} className={class_name} onClick={this.selectedChild} data-type='template' data-name={value}>
                                    <a>{value}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <TemplateEditor template={template} updateTemplate={this.props.updateTemplate}/>
            </div>
        );
    }
});

export default TemplateList;
