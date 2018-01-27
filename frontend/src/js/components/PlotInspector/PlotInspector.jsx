import React from 'react'
import { Button } from 'react-bootstrap'
import './PlotInspector.scss'

class PlotInspector extends React.PureComponent {

    render() {
        console.log(this.props.plot)
        return (
            <tr className="plot-inspector active">
                <td><Button className="glyphicon glyphicon-remove"></Button></td>
                <td>
                    <select value={this.props.cur_var1} onChange={this.props.handleSelectVar1} className="form-control">
                        {
                            this.props.variables.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select> 
                </td>
                <td>
                    <select value={this.props.cur_var2} onChange={this.props.handleSelectVar2} className="form-control">
                        {
                            this.props.variables.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select value={this.props.cur_gm_type} onChange={this.props.handleSelectGMType} className="form-control">
                        {
                            this.props.graphics_method_types.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select value={this.props.cur_gm} onChange={this.props.handleSelectGM} className="form-control">
                        {
                            this.props.graphics_methods.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select value={this.props.cur_template} onChange={(e)=>this.props.handleSelectTemplate(e, this.props.plot_index)} className="form-control">
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
    plot: React.PropTypes.object,
    plot_index: React.PropTypes.number,
    variables: React.PropTypes.array,
    graphics_method_types: React.PropTypes.array, // parent graphics methods. E.g. "boxfill"
    graphics_methods: React.PropTypes.array, // child GMs. E.g. "default"
    templates: React.PropTypes.array,
    cur_var1: React.PropTypes.string,
    cur_var2: React.PropTypes.string,
    cur_gm_type: React.PropTypes.string,
    cur_gm: React.PropTypes.string,
    cur_template: React.PropTypes.string,
    handleSelectVar1: React.PropTypes.func,
    handleSelectVar2: React.PropTypes.func,
    handleSelectGMType: React.PropTypes.func,
    handleSelectGM: React.PropTypes.func,
    handleSelectTemplate: React.PropTypes.func,
}

export default PlotInspector;

