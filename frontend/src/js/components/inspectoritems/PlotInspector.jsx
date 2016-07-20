import React from 'react'

var PlotInspector = React.createClass({
    getPlotItems(cur_plot_index) {
        var items = [];
        for (var i = 0; i < this.props.selectedCell.plots.length; i++) {
            items.push(
                <li key={i} onClick={this.props.changePlot.bind(this, i)} className={'inspector-dropdown-item ' + (i === cur_plot_index
                    ? 'active'
                    : '')}>{i}</li>
            )
        }
        return items;
    },
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid text-center">
                        <p className='side-nav-header'>Inspector</p>
                    </div>
                </nav>
                    <div className='inspector-selector btn-group'>
                        <h5 className='black'>Plot:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <button type="button" className="btn btn-info dropdown-toggle dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className='inspector-dropdown-title'>{(this.props.populateInspector ? 'Plot ' + this.props.plotBeingEdited : [] )}</span>
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            {(this.props.populateInspector ? this.getPlotItems(this.props.plotBeingEdited) : [])}
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
        )
    }
})
export default PlotInspector;
