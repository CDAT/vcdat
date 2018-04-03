import React, {PropTypes} from 'react'
import { Button } from 'react-bootstrap'
import ColormapEditor from "../modals/ColormapEditor/ColormapEditor.jsx"
import { ONE_VAR_PLOTS } from '../../constants/Constants.js'
class PlotInspector extends React.PureComponent {

    render() {
        return (
            <div className="plot-inspector-wrapper">
                <div className="tools-container">
                    <div className="tools-header">
                        <p>Tools</p>
                        <span onClick={this.props.startTour} className="help-button main-help btn btn-xs btn-default"><i className="glyphicon glyphicon-question-sign"></i> Help</span>
                    </div>
                    <span className="btn-group" role="group">
                        <button
                            className='btn btn-default btn-sm'
                            onClick={this.props.onUndo}
                            disabled={!this.props.undoEnabled}>
                            <i className='glyphicon glyphicon-share-alt icon-flipped'></i>
                            <span> Undo</span>
                        </button>
                        <button
                            className='btn btn-default btn-sm'
                            onClick={this.props.onRedo}
                            disabled={!this.props.redoEnabled}>
                            <i className='glyphicon glyphicon-share-alt'></i>
                            <span> Redo</span>
                        </button>
                        <button 
                            id="add-plot-button"
                            className="btn btn-default btn-sm"
                            onClick={this.props.handleAddPlot}
                            disabled={!(this.props.cell_row > -1 && this.props.cell_col > -1)}>
                            <i className="glyphicon glyphicon-plus green"></i>
                            <span> Add Plot</span>
                        </button>
                    </span>
                    <span className="btn-group" role="group">
                        <button 
                            id="clear-canvas-button"
                            className="btn btn-default btn-sm material-icons-button"
                            onClick={this.props.handleClearCell}
                            title="Clear selected plot">
                            <i className="material-icons" style={{color: "red"}}>clear</i>
                            <span> Clear Cell</span>
                        </button>
                        <button 
                            id="open-colormap-editor-button"
                            className="btn btn-default btn-sm material-icons-button"
                            onClick={this.props.handleOpenColormapEditor}
                            title="Open the colormap editor">
                            <i className="material-icons" style={{color: "blue"}}>color_lens</i>
                            <span> Colormap Editor</span>
                        </button>
                    </span>
                    <span className="btn-group" role="group">
                        <button 
                            id="save-plot-button"
                            className="btn btn-default btn-sm material-icons-button"
                            onClick={this.props.handleSavePlot}
                            title="Open the colormap editor">
                            <i className="material-icons" >save</i>
                            <span> Save Plot</span>
                        </button>
                    </span>
                </div>
                <div className="plot-inspector-container">
                    <table className="table table-condensed">
                        <thead>
                            <tr>
                                <th scope="col" className="no-padding-top delete-col">Delete Plot</th>
                                <th scope="col" className="no-padding-top">Var 1</th>
                                <th scope="col" className="no-padding-top">Var 2</th>
                                <th scope="col" className="no-padding-top">Graphics Type</th>
                                <th scope="col" className="no-padding-top">Graphics Method</th>
                                <th scope="col" className="no-padding-top">Template</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.plots && this.props.plots.map((plot, plot_index) => {
                                    let cur_var1 = plot.variables.length > 0 ? plot.variables[0] : ""
                                    let cur_var2 = plot.variables.length > 1 ? plot.variables[1] : ""
                                    let cur_gm_type = plot.graphics_method_parent
                                    let cur_gm = plot.graphics_method
                                    let cur_template = plot.template
                                    let graphics_methods
                                    try{
                                        graphics_methods = Object.keys(this.props.all_graphics_methods[plot.graphics_method_parent])
                                    }
                                    catch(e){
                                        console.warn(e)
                                        graphics_methods = []
                                    }
                                    return (
                                        <tr key={plot_index} className="plot-inspector active">
                                            <td>
                                                <Button
                                                    id="delete-plot-button"
                                                    className="glyphicon glyphicon-remove"
                                                    disabled={this.props.disable_delete}
                                                    onClick={()=>{this.props.handleDeletePlot(plot_index)}}>
                                                </Button>
                                            </td>
                                            <td>
                                                <select
                                                    value={cur_var1}
                                                    onChange={(e)=>this.props.handleSelectVar1(e.target.value, plot_index)}
                                                    className="form-control"
                                                    id="plot-inspector-variable1-select"
                                                    >
                                                    <option value=""></option>
                                                    {
                                                        this.props.variables.map((name, index)=>{
                                                            return <option key={index} value={name}>{name}</option>
                                                        })
                                                    }
                                                </select> 
                                            </td>
                                            <td>
                                                <select 
                                                    value={cur_var2}
                                                    onChange={(e)=>this.props.handleSelectVar2(e.target.value, plot_index)}
                                                    className="form-control"
                                                    id="plot-inspector-variable2-select"
                                                    disabled={ONE_VAR_PLOTS.indexOf(cur_gm_type) >= 0}
                                                    >
                                                    <option value=""></option>
                                                    {
                                                        this.props.variables.map((name, index)=>{
                                                            return <option key={index} value={name}>{name}</option>
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select 
                                                    value={cur_gm_type}
                                                    onChange={(e)=>this.props.handleSelectGMType(e.target.value, plot_index)}
                                                    className="form-control"
                                                    id="plot-inspector-graphics-method-type-select"
                                                    >
                                                    {
                                                        this.props.graphics_method_types.sort().map((name, index)=>{
                                                            return <option key={index} value={name}>{name}</option>
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select 
                                                    value={cur_gm}
                                                    onChange={(e)=>{
                                                        this.props.handleSelectGM(cur_gm_type, e.target.value, plot_index)
                                                    }}
                                                    className="form-control"
                                                    id="plot-inspector-graphics-method-select"
                                                    >
                                                    {
                                                        graphics_methods.sort().map((name, index)=>{
                                                            return <option key={index} value={name}>{name}</option>
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={cur_template}
                                                    onChange={(e)=>this.props.handleSelectTemplate(e.target.value, plot_index)}
                                                    className="form-control"
                                                    id="plot-inspector-template-select"
                                                    >
                                                    {
                                                        this.props.templates.sort((a, b)=>{
                                                            return a.toLowerCase().localeCompare(b.toLowerCase());
                                                        }).map((name, index)=>{
                                                            return <option key={index} value={name}>{name}</option>
                                                        })
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {this.props.show_colormap_editor && 
                    <ColormapEditor show={this.props.show_colormap_editor} close={this.props.handleCloseColormapEditor}/>
                }
            </div>
        )
    }
}

PlotInspector.propTypes = {
    cell_row: PropTypes.number,
    cell_col: PropTypes.number,
    plots: PropTypes.array,
    variables: PropTypes.arrayOf(PropTypes.string).isRequired,
    all_graphics_methods: PropTypes.object,
    graphics_method_types: PropTypes.arrayOf(PropTypes.string).isRequired, // parent graphics methods. E.g. "boxfill"
    templates: PropTypes.arrayOf(PropTypes.string).isRequired,
    disable_delete: PropTypes.bool,
    handleSelectVar1: PropTypes.func,
    handleSelectVar2: PropTypes.func,
    handleSelectGMType: PropTypes.func,
    handleSelectGM: PropTypes.func,
    handleSelectTemplate: PropTypes.func,
    handleAddPlot: PropTypes.func,
    handleDeletePlot: PropTypes.func,
    handleClearCell: PropTypes.func,
    handleOpenColormapEditor: PropTypes.func,
    handleCloseColormapEditor: PropTypes.func,
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    undoEnabled: PropTypes.bool,
    redoEnabled: PropTypes.bool,
    show_colormap_editor: PropTypes.bool,
    startTour: PropTypes.func,
    handleSavePlot: PropTypes.func,
}

export default PlotInspector;

