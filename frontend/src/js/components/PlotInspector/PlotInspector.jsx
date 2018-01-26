import React from 'react'
import { Button } from 'react-bootstrap'
import './PlotInspector.scss'

class PlotInspector extends React.PureComponent {

    render() {
        console.log(this.props.plot)
        return (
            <tr className="plot-inspector">
                <td><Button className="glyphicon glyphicon-remove"></Button></td>
                <td>
                    <select className="form-control">
                        {
                            this.props.variables.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select> 
                </td>
                <td>
                    <select className="form-control">
                        {
                            this.props.variables.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select className="form-control">
                        {
                            this.props.graphics_method_types.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select className="form-control">
                        {
                            this.props.graphics_methods.map((name, index)=>{
                                return <option key={index} value={name}>{name}</option>
                            })
                        }
                    </select>
                </td>
                <td>
                    <select className="form-control">
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
    variables: React.PropTypes.array,
    graphics_method_types: React.PropTypes.array, // parent graphics methods. E.g. "boxfill"
    graphics_methods: React.PropTypes.array, // child GMs. E.g. "default"
    templates: React.PropTypes.array,
}

export default PlotInspector;

