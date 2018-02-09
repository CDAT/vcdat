import React, {PropTypes} from 'react'
import { Button } from 'react-bootstrap'
import { ONE_VAR_PLOTS } from '../../constants/Constants.js'
class PlotInspector extends React.PureComponent {

    render() {
        return (
            <tr className="plot-inspector active">
                <td>
                    <Button
                        id="delete-plot-button"
                        className="glyphicon glyphicon-remove"
                        disabled={this.props.disable_delete}
                        onClick={()=>{this.props.handleDeletePlot(this.props.plot_index)}}>
                    </Button>
                </td>
                <td>
                    <select
                        value={this.props.cur_var1}
                        onChange={(e)=>this.props.handleSelectVar1(e.target.value, this.props.plot_index)}
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
                        value={this.props.cur_var2}
                        onChange={(e)=>this.props.handleSelectVar2(e.target.value, this.props.plot_index)}
                        className="form-control"
                        id="plot-inspector-variable2-select"
                        disabled={ONE_VAR_PLOTS.indexOf(this.props.cur_gm_type) >= 0}
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
                        value={this.props.cur_gm_type}
                        onChange={(e)=>this.props.handleSelectGMType(e.target.value, this.props.plot_index)}
                        className="form-control"
                        id="plot-inspector-graphics-method-type-select"
                        >
                        {
                            this.props.graphics_method_types.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select 
                        value={this.props.cur_gm}
                        onChange={(e)=>this.props.handleSelectGM(this.props.cur_gm_type, e.target.value, this.props.plot_index)}
                        className="form-control"
                        id="plot-inspector-graphics-method-select"
                        >
                        {
                            this.props.graphics_methods.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select
                        value={this.props.cur_template}
                        onChange={(e)=>this.props.handleSelectTemplate(e.target.value, this.props.plot_index)}
                        className="form-control"
                        id="plot-inspector-template-select"
                        >
                        {
                            this.props.templates.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
            </tr>
        )
    }
}

PlotInspector.propTypes = {
    plot: PropTypes.object,
    plot_index: PropTypes.number,
    variables: PropTypes.arrayOf(PropTypes.string).isRequired,
    graphics_method_types: PropTypes.arrayOf(PropTypes.string).isRequired, // parent graphics methods. E.g. "boxfill"
    graphics_methods: PropTypes.arrayOf(PropTypes.string).isRequired, // child GMs. E.g. "default"
    templates: PropTypes.arrayOf(PropTypes.string).isRequired,
    cur_var1: PropTypes.string,
    cur_var2: PropTypes.string,
    cur_gm_type: PropTypes.string,
    cur_gm: PropTypes.string,
    cur_template: PropTypes.string,
    disable_delete: PropTypes.bool,
    handleSelectVar1: PropTypes.func,
    handleSelectVar2: PropTypes.func,
    handleSelectGMType: PropTypes.func,
    handleSelectGM: PropTypes.func,
    handleSelectTemplate: PropTypes.func,
    handleDeletePlot: PropTypes.func,
}

export default PlotInspector;

