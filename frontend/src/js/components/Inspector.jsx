import React from 'react'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'

var Inspector = React.createClass({
    getPlotItems(cur_plot_index) {
        var items = [];
        for (var i = 0; i < this.props.selected_cell.plots.length; i++) {
            items.push(
                <li key={i} className={'inspector-dropdown-item ' + (i === cur_plot_index
                    ? 'active'
                    : '')}>{i}</li>
            )
        }
        return items;
    },
    render() {
        var variable1 = '';
        var variable2 = '';
        var template = '';
        var graphics_method_parent = '';
        var graphics_method = '';
        var cur_plot = this.props.selected_cell.plots[this.props.plot_being_edited];

        if (this.props.selected_cell_row !== -1 || this.props.selected_cell_col !== -1) {
            if (cur_plot.variables[0]) {
                variable1 = cur_plot.variables[0];
            }
            if (cur_plot.variables[1]) {
                variable2 = cur_plot.variables[1];
            }
            template = cur_plot.template;
            graphics_method_parent = cur_plot.graphics_method_parent;
            graphics_method = cur_plot.graphics_method;
        }

        return (
            <div id='inspector' className=' scroll-area-list-parent right-side-list'>
                <nav className="navbar navbar-default">
                    <div className="container-fluid text-center">
                        <p className='side-nav-header'>Inspector</p>
                    </div>
                </nav>
                <div className='scroll-area'>
                    <div className='inspector-selector btn-group'>
                        <h5 className='black'>Plot:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className='inspector-dropdown-title'>{'Plot ' + this.props.plot_being_edited}</span>
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            {this.getPlotItems(this.props.plot_being_edited)
}
                                        </ul>
                                    </td>
                                    <td className='edit-button'>
                                        <button type='button' className='btn btn-default'>Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='inspector-selector btn-group'>
                        <h5 className='black'>Variable(s):</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className='dropdown-container'>
                                            <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span className='inspector-dropdown-title'>{variable1}</span>
                                                <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu">
                                                {this.props.variables.map((value, index) => {
                                                    return (
                                                        <li onClick={this.props.changePlotVar.bind(this, 0, value)} key={'inspector_var_' + value} className={'inspector-dropdown-item ' + (value === variable1
                                                            ? 'active'
                                                            : '')}>{value}</li>
                                                    )
                                                })
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
                                        <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={graphics_method_parent !== 'vector'}>
                                            <span className='inspector-dropdown-title'>{variable2}</span>
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            {this.props.variables.map((value, index) => {
                                                return (
                                                    <li onClick={this.props.changePlotVar.bind(this, 1, value)} key={'inspector_var_' + value} className={'inspector-dropdown-item ' + (value === variable2
                                                        ? 'active'
                                                        : '')}>{value}</li>
                                                )
                                            })
}
                                        </ul>
                                    </td>
                                    <td className='edit-button'>
                                        <button type='button' className='btn btn-default' disabled={graphics_method !== 'vector'}>Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='inspector-selector btn-group'>
                        <h5 className='black'>Graphics Method:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>

                                        <div className='dropdown-container'>
                                            <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                                <span className='inspector-dropdown-title'>{graphics_method_parent}</span>
                                                <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu">
                                                {Object.keys(this.props.graphics_methods).map((value, index) => {
                                                    return (
                                                        <li onClick={this.props.changePlotGM.bind(this, true, value)} key={'inspector_gmp_' + value} className={'inspector-dropdown-item ' + (value === graphics_method_parent
                                                            ? 'active'
                                                            : '')}>{value}</li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className='dropdown-container'>

                                            <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span className='inspector-dropdown-title'>{graphics_method}</span>
                                                <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu">
                                                {this.props.graphics_methods[graphics_method_parent].map((value, index) => {
                                                    return (
                                                        <li onClick={this.props.changePlotGM.bind(this, false, value)} key={'inspector_gm_' + value} className={'inspector-dropdown-item ' + (value === graphics_method
                                                            ? 'active'
                                                            : '')}>{value}</li>
                                                    )
                                                })}
                                            </ul>

                                        </div>
                                    </td>
                                    <td className='edit-button'>
                                        <button type='button' className='btn btn-default'>Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='inspector-selector btn-group'>
                        <h5 className='black'>Template:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className='inspector-dropdown-title'>{template}</span>
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            {this.props.templates.map((value, index) => {
                                                return (
                                                    <li onClick={this.props.changePlotTemplate.bind(this, value)} key={'inspector_temp_' + value} className={'inspector-dropdown-item ' + (value === template
                                                        ? 'active'
                                                        : '')}>{value}</li>
                                                )
                                                })
                                            }
                                        </ul>
                                    </td>
                                    <td className='edit-button'>
                                        <button type='button' className='btn btn-default'>Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    var cur_sheet_index = state.present.sheets_model.cur_sheet_index;
    var selected_cell_row = state.present.sheets_model.sheets[cur_sheet_index].selected_cell_indices[0];
    var selected_cell_col = state.present.sheets_model.sheets[cur_sheet_index].selected_cell_indices[1];
    var cell = state.present.sheets_model.sheets[cur_sheet_index].cells[selected_cell_row][selected_cell_col];
    return {
        variables: state.present.variables,
        graphics_methods: state.present.graphics_methods,
        templates: state.present.templates,
        selected_cell_row: selected_cell_row,
        selected_cell_col: selected_cell_col,
        selected_cell: cell,
        plot_being_edited: cell.plot_being_edited
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePlotVar: (var_being_changed, value) => dispatch(Actions.changePlotVar(var_being_changed, value)),
        changePlotGM: (parent, value) => dispatch(Actions.changePlotGM(parent, value)),
        changePlotTemplate: (value) => dispatch(Actions.changePlotTemplate(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspector);
