import React from 'react'

var TemplateInspector = React.createClass({
    render() {
        return (
            <div className='inspector-selector btn-group'>
                <h5 className='black'>Template:</h5>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className='inspector-dropdown-title'>{this.props.template}</span>
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    {this.props.templates.map((value, index) => {
                                        return (
                                            <li onClick={this.props.changePlotTemplate.bind(this, value)} key={'inspector_temp_' + value} className={'inspector-dropdown-item ' + (value === this.props.template
                                                ? 'active'
                                                : '')}>{value}</li>
                                        )
                                    })}
                                </ul>
                            </td>
                            <td className='edit-button'>
                                <button type='button' className='btn btn-default'>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
})

export default TemplateInspector;
