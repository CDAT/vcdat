import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plot from './Plot.jsx'
import AddPlotZone from './AddPlotZone.jsx'

class Plotter extends Component {
    
    render() {
        return (
            <div className={this.props.onTop ? 'cell-stack-top plotter' : 'cell-stack-bottom plotter'}>
                <div className='plotter-plots'>
                    {(() => {
                        let plotters = [];
                        for (var i = 0; i < this.props.cell.plots.length; i++) {
                            let plot = this.props.cell.plots[i];
                            let plot_name = 'plot' + this.props.row + this.props.col + i;
                            plotters.push(
                                <Plot
                                    onHover={this.props.onHover}
                                    onDrop={this.props.onDrop}
                                    key={i}
                                    plotName={plot_name}
                                    plot={plot}
                                    plotIndex={i}
                                    swapVariableInPlot={
                                        this.props.swapVariableInPlot.bind(this, this.props.row, this.props.col)
                                    } swapGraphicsMethodInPlot={
                                        this.props.swapGraphicsMethodInPlot.bind(this, this.props.row, this.props.col)
                                    } swapTemplateInPlot={
                                        this.props.swapTemplateInPlot.bind(this, this.props.row, this.props.col)
                                    }
                                />
                            );
                        }
                        return plotters;
                    })()}
                    <AddPlotZone 
                        onHover={this.props.onHover}
                        onDrop={this.props.onDrop}
                        addPlot={this.props.addPlot}
                        row={this.props.row}
                        col={this.props.col}
                    />
                </div>
            </div>
        )
    }
}

Plotter.propTypes = {
    addPlot: PropTypes.func,
    row: PropTypes.number,
    col: PropTypes.number,
    cell: PropTypes.object,
    swapTemplateInPlot: PropTypes.func,
    swapVariableInPlot: PropTypes.func,
    swapGraphicsMethodInPlot: PropTypes.func,
    onDrop: PropTypes.func,
    onTop: PropTypes.bool,
}

export default Plotter;
