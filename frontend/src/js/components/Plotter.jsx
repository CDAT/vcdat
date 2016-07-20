import React from 'react'
import Plot from './Plot.jsx'

var Plotter = React.createClass({
    initDrop() {
        $('.cell-stack-bottom').droppable({
            over: (event, ui) => {
                $(event.target).addClass('plotter-to-top');
            },
            out: (event, ui) => {
                $(event.target).removeClass('plotter-to-top');
            }
        })
    },
    addPlot(event, ui) {
        let variable = null;
        let graphics_method_parent = null;
        let graphics_method = null;
        let template = null;
        switch (ui.draggable.attr('data-type')) {
            case 'variable':
                this.props.addPlot(ui.draggable.attr('data-name'), graphics_method_parent, graphics_method, template, this.props.row, this.props.col);
                break
            case 'graphics_method':
                this.props.addPlot(variable, ui.draggable.attr('data-parent'), ui.draggable.attr('data-name'), template, this.props.row, this.props.col);
                break
            case 'template':
                this.props.addPlot(variable, graphics_method_parent, graphics_method, ui.draggable.attr('data-name'), this.props.row, this.props.col);
                break
            default:
                break
        }
        $('.cell-stack-bottom').removeClass('plotter-to-top');
    },
    componentDidMount(){
        this.initDrop();
        $('#add-plot-' + this.props.row + this.props.col).droppable({
            tolerance: 'pointer',
            hoverClass: 'plot-hover',
            drop: this.addPlot
        })
    },
    componentDidUpdate(){
        this.initDrop();
    },
    render() {
        return (
            <div className='cell-stack-bottom'>
                <div className='plotter-plots'>
                    {(() => {
                        let plotters = [];
                        for (var i = 0; i < this.props.cell.plots.length; i++) {
                            let plot = this.props.cell.plots[i];
                            let plot_name = 'plot' + this.props.row + this.props.col + i;
                            plotters.push(<Plot key={i} plotName={plot_name} plot={plot} plotIndex={i} swapVariableInPlot={this.props.swapVariableInPlot.bind(this, this.props.row, this.props.col)} swapGraphicsMethodInPlot={this.props.swapGraphicsMethodInPlot.bind(this, this.props.row, this.props.col)} swapTemplateInPlot={this.props.swapTemplateInPlot.bind(this, this.props.row, this.props.col)}/>)
                        }
                        return plotters;
                    })()}
                    <div className='plotter-add-plot' id={'add-plot-' + this.props.row + this.props.col}>
                        <img src='deps/add_plot.svg' alt='Add Plot'></img>
                    </div>
                </div>
            </div>
        )
    }
})

export default Plotter;
