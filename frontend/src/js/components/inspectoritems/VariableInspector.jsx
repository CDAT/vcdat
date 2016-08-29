import React from 'react'

var VariableInspector = React.createClass({
    propTypes: {
        changePlotTemplate: React.PropTypes.func,
        changePlotVar: React.PropTypes.func,
        nonVector:React.PropTypes.bool,
        populateInspector: React.PropTypes.bool,
        variable1: React.PropTypes.string,
        variable2: React.PropTypes.string,
        variables: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])
    },
    render() {
        return (
            <div className='inspector-selector btn-group'>
                <h5 className='black'>Variable(s):</h5>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className='dropdown-container'>
                                    <button type="button" className="btn btn-info dropdown-toggle dropdown-button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        <span className='inspector-dropdown-title'>{this.props.variable1}</span>
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        {
                                            (this.props.populateInspector
                                                ? Object.keys(this.props.variables).map((value, index) => {
                                                    return (
                                                        <li onClick={this.props.changePlotVar.bind(this, 0, value)}
                                                            key={'inspector_var_' + value}
                                                            className={'inspector-dropdown-item ' + (
                                                                value === this.props.variable1
                                                                    ? 'active'
                                                                    : '')}
                                                        >
                                                            {value}
                                                        </li>
                                                    );})
                                                : [])
                                        }
                                    </ul>
                                </div>
                            </td>
                            <td className='edit-button'>
                                <button type='button' className='btn btn-default'>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button type="button" className="btn btn-info dropdown-toggle dropdown-button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    disabled={!this.props.populateInspector || this.props.nonVector}
                                >
                                    <span className='inspector-dropdown-title'>{this.props.variable2}</span>
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        (this.props.populateInspector
                                            ? Object.keys(this.props.variables).map((value, index) => {
                                                return (
                                                    <li onClick={this.props.changePlotVar.bind(this, 1, value)}
                                                        key={'inspector_var_' + value}
                                                        className={
                                                            'inspector-dropdown-item ' + (
                                                                value === this.props.variable2
                                                                    ? 'active'
                                                                    : '')}
                                                    >
                                                        {value}
                                                    </li>
                                        )
                                    }) : [])}
                                </ul>
                            </td>
                            <td className='edit-button'>
                                <button type='button' className='btn btn-default'
                                    disabled={!this.props.populateInspector || this.props.nonVector}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
})

export default VariableInspector;
