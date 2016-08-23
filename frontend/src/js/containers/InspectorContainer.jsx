import React from 'react'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'
import VariableInspector from '../components/inspectoritems/VariableInspector.jsx'
import PlotInspector from '../components/inspectoritems/PlotInspector.jsx'
import GraphicsMethodInspector from '../components/inspectoritems/GraphicsMethodInspector.jsx'
import TemplateInspector from '../components/inspectoritems/TemplateInspector.jsx'

var InspectorContainer = React.createClass({
    render() {

        var template = '';
        var graphics_method_parent = '';
        var graphics_method = '';
        var variable1 = '';
        var variable2 = '';

        if (this.props.populate_inspector) {
            var cur_plot = this.props.selected_cell.plots[this.props.plot_being_edited];
            template = cur_plot.template;
            graphics_method_parent = cur_plot.graphics_method_parent;
            graphics_method = cur_plot.graphics_method;
            variable1 = cur_plot.variables[0];
            variable2 = cur_plot.variables[1];
        }

        return (
            <div id='inspector' className=' scroll-area-list-parent right-side-list'>
                <div className='scroll-area'>
                    <PlotInspector
                        populateInspector={this.props.populate_inspector}
                        selectedCell={this.props.selected_cell}
                        plotBeingEdited={this.props.plot_being_edited}
                        changePlot={this.props.changePlot}
                    />
                    <VariableInspector
                        populateInspector={this.props.populate_inspector}
                        variables={this.props.variables}
                        nonVector={this.props.non_vector}
                        variable1={variable1}
                        variable2={variable2}
                        changePlotVar={this.props.changePlotVar}
                    />
                    <GraphicsMethodInspector
                        populateInspector={this.props.populate_inspector}
                        graphicsMethods={this.props.graphics_methods}
                        graphicsMethod={graphics_method}
                        graphicsMethodParent={graphics_method_parent}
                        changePlotGM={this.props.changePlotGM}
                    />
                    <TemplateInspector
                        populateInspector={this.props.populate_inspector}
                        template={template}
                        templates={this.props.templates}
                        changePlotTemplate={this.props.changePlotTemplate}
                    />
                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    var cur_sheet_index = state.present.sheets_model.cur_sheet_index;
    var selected_cell_indices = state.present.sheets_model.sheets[cur_sheet_index].selected_cell_indices;
    var populate_inspector = (selected_cell_indices.length === 1 &&
                              selected_cell_indices[0][0] !== -1 &&
                              selected_cell_indices[0][0] !== -1);
    var cell = null;
    var plot_being_edited = null;
    var non_vector = null;
    if (populate_inspector) {
        var selected_cell_row = selected_cell_indices[0][0];
        var selected_cell_col = selected_cell_indices[0][1];
        cell = state.present.sheets_model.sheets[cur_sheet_index].cells[selected_cell_row][selected_cell_col];
        plot_being_edited = cell.plot_being_edited;
        non_vector = cell.plots[cell.plot_being_edited].graphics_method_parent !== 'vector';
    }
    return {
        variables: state.present.variables,
        graphics_methods: state.present.graphics_methods,
        templates: state.present.templates,
        selected_cell: cell,
        plot_being_edited: plot_being_edited,
        non_vector: non_vector,
        populate_inspector: populate_inspector
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePlot: (value) => dispatch(Actions.changePlot(value)),
        changePlotVar: (var_being_changed, value) => dispatch(Actions.changePlotVar(var_being_changed, value)),
        changePlotGM: (parent, value) => dispatch(Actions.changePlotGM(parent, value)),
        changePlotTemplate: (value) => dispatch(Actions.changePlotTemplate(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InspectorContainer);
