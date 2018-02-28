import React from 'react'
import { connect } from 'react-redux'
import Actions from '../../constants/Actions.js'
import PlotInspector from './PlotInspector.jsx'
import './PlotInspector.scss'

class PlotInspectorWrapper extends React.Component {

    constructor(props){
        super(props)
        this.handleSelectVar1 = this.handleSelectVar1.bind(this)
        this.handleSelectVar2 = this.handleSelectVar2.bind(this)
        this.handleSelectGMType = this.handleSelectGMType.bind(this)
        this.handleSelectGM = this.handleSelectGM.bind(this)
        this.handleSelectTemplate = this.handleSelectTemplate.bind(this)
        this.handleAddPlot = this.handleAddPlot.bind(this)
        this.handleDeletePlot = this.handleDeletePlot.bind(this)
    }

    handleSelectVar1(var1, plot_index){
        const FIRST_VARIABLE = 0
        this.props.swapVariableInPlot(this.props.cell_row, this.props.cell_col, var1, plot_index, FIRST_VARIABLE)
    }

    handleSelectVar2(var2, plot_index){
        const SECOND_VARIABLE = 1
        if(var2 === ""){
            this.props.deleteVariableInPlot(this.props.cell_row, this.props.cell_col, plot_index, SECOND_VARIABLE)
        }
        else{
            this.props.swapVariableInPlot(this.props.cell_row, this.props.cell_col, var2, plot_index, SECOND_VARIABLE)
        }
    }

    handleSelectGMType(graphic_type, plot_index){
        let graphics_method = ""
        if(this.props.all_graphics_methods[graphic_type]["default"]){ // when switching the graphics type, try to set the method to default
            graphics_method = "default"
        }
        else if(Object.keys(this.props.all_graphics_methods[graphic_type]).length > 0){ // if there is no default check that the parent/type exists
            graphics_method = Object.keys(this.props.all_graphics_methods[graphic_type])[0] // Then set to the first entry 
        }
        /* istanbul ignore next */
        else{
            throw "Error: Graphics type has no child methods."
        }
        this.props.swapGraphicsMethodInPlot(this.props.cell_row, this.props.cell_col, graphic_type, graphics_method, plot_index)
    }

    handleSelectGM(graphic_type, graphics_method, plot_index){
        this.props.swapGraphicsMethodInPlot(this.props.cell_row, this.props.cell_col, graphic_type, graphics_method, plot_index)
    }

    handleSelectTemplate(template, plot_index){
        this.props.swapTemplateInPlot(this.props.cell_row, this.props.cell_col, template, plot_index)
    }

    handleAddPlot(){
        this.props.addPlot(null, null, null, null, this.props.cell_row, this.props.cell_col)
    }

    handleDeletePlot(plot_index){
        this.props.deletePlot(this.props.cell_row, this.props.cell_col, plot_index)
    }
    
    render() {
        return (
            <div className="plot-inspector-wrapper">
                <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <p className="top-nav-header">Plot Inspector</p>
                            <button 
                                id="add-plot-button"
                                className="btn btn-default btn-sm"
                                onClick={this.handleAddPlot}
                                disabled={!(this.props.cell_row > -1 && this.props.cell_col > -1)}>
                                <i className="glyphicon glyphicon-plus green"></i>
                                <span> Add Plot</span>
                            </button>
                        </div>
                </nav>
                <div className="plot-inspector-container">
                    <table className="table table-condensed">
                        <thead>
                            <tr>
                                <th scope="col" className="no-padding-top">Delete</th>
                                <th scope="col" className="no-padding-top">Var 1</th>
                                <th scope="col" className="no-padding-top">Var 2</th>
                                <th scope="col" className="no-padding-top">Graphics Type</th>
                                <th scope="col" className="no-padding-top">Graphics Method</th>
                                <th scope="col" className="no-padding-top">Template</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.plots && this.props.plots.map((plot, index) => {
                                    let graphics_methods
                                    try{
                                        graphics_methods = Object.keys(this.props.all_graphics_methods[plot.graphics_method_parent])
                                    }
                                    catch(e){
                                        console.log(e)
                                        graphics_methods = []
                                    }

                                    return(
                                        <PlotInspector
                                            key={index}
                                            plot_index={index}
                                            plot={plot}
                                            variables={this.props.variables}
                                            graphics_method_types={this.props.graphics_method_types}
                                            graphics_methods={graphics_methods}
                                            templates={this.props.templates}
                                            cur_var1={plot.variables.length > 0 ? plot.variables[0] : ""}
                                            cur_var2={plot.variables.length > 1 ? plot.variables[1] : ""}
                                            cur_gm_type={plot.graphics_method_parent}
                                            cur_gm={plot.graphics_method}
                                            cur_template={plot.template}
                                            handleSelectVar1={this.handleSelectVar1}
                                            handleSelectVar2={this.handleSelectVar2}
                                            handleSelectGMType={this.handleSelectGMType}
                                            handleSelectGM={this.handleSelectGM}
                                            handleSelectTemplate={this.handleSelectTemplate}
                                            handleDeletePlot={this.handleDeletePlot}
                                            disable_delete={this.props.plots.length < 2}
                                        />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

PlotInspectorWrapper.propTypes = {
    plots: React.PropTypes.array,
    all_graphics_methods: React.PropTypes.object,
    variables: React.PropTypes.array,
    graphics_method_types: React.PropTypes.array,
    templates: React.PropTypes.array,
    cell_row: React.PropTypes.number,
    cell_col: React.PropTypes.number,
    swapVariableInPlot: React.PropTypes.func,
    swapGraphicsMethodInPlot: React.PropTypes.func,
    swapTemplateInPlot: React.PropTypes.func,
    deleteVariableInPlot: React.PropTypes.func,
    addPlot: React.PropTypes.func,
    deletePlot: React.PropTypes.func,
}

const mapStateToProps = (state) => {
    let cell_id_string = state.present.sheets_model.selected_cell_id // format of `sheet_row_col`. Ex: "0_0_0"
    let sheet_row_col = cell_id_string.split("_").map(function (str_val) { return Number(str_val) })
    let sheet = sheet_row_col[0]
    let row = sheet_row_col[1]
    let col = sheet_row_col[2]
    let plots = []
    if(row != -1 && col != -1 && sheet != -1 && state.present.sheets_model.sheets && state.present.sheets_model.sheets[sheet]){
        plots = state.present.sheets_model.sheets[sheet].cells[row][col].plots
    }
    return {
        plots: plots,
        cell_row: row,
        cell_col: col,
        all_graphics_methods: state.present.graphics_methods,
        variables: state.present.variables ? Object.keys(state.present.variables) : [],
        graphics_method_types: state.present.graphics_methods ? Object.keys(state.present.graphics_methods) : [],
        templates: state.present.templates ? Object.keys(state.present.templates) : [],
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addPlot: function(variable=null, graphics_method_parent=null, graphics_method=null, template=null, row, col) {
            dispatch(Actions.addPlot(variable, graphics_method_parent, graphics_method, template, row, col))
        },
        deletePlot: function(row, col, index) {
            dispatch(Actions.deletePlot(row, col, index))
        },
        swapVariableInPlot: function(row, col, value, index, var_being_changed=0) {
            dispatch(Actions.swapVariableInPlot(value, row, col, index, var_being_changed))
        },
        swapGraphicsMethodInPlot: function(row, col, graphics_method_parent, graphics_method, index) {
            dispatch(Actions.swapGraphicsMethodInPlot(graphics_method_parent, graphics_method, row, col, index))
        },
        swapTemplateInPlot: function(row, col, value, index) {
            dispatch(Actions.swapTemplateInPlot(value, row, col, index))
        },
        deleteVariableInPlot: function(row, col, index, var_being_deleted){
            dispatch(Actions.deleteVariableInPlot(row, col, index, var_being_deleted))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotInspectorWrapper);
export {PlotInspectorWrapper as PurePlotInspectorWrapper}

