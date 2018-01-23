import React from 'react'
import InspectorToolbar from './InspectorToolbar.jsx'

var PlotInspector = React.createClass({
    propTypes: {
        changePlot: React.PropTypes.func,
        plotBeingEdited: React.PropTypes.number,
        populateInspector: React.PropTypes.bool,
        selectedCell: React.PropTypes.object
    },
    getPlotItems(cur_plot_index) {
        var items = [];
        for (var i = 0; i < this.props.selectedCell.plots.length; i++) {
            items.push(
                <li key={i} onClick={this.props.changePlot.bind(this, i)}
                    className={
                        'inspector-dropdown-item ' + (i === cur_plot_index
                            ? 'active'
                            : '')
                        }
                >
                        {i}
                </li>
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
                        <InspectorToolbar />
                    </div>
            </div>
        )
    }
})
export default PlotInspector;
