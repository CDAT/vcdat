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
        console.log('addplot', this.props.row, this.props.col);
        let variable = null;
        let graphics_method_parent = null;
        let graphics_method = null;
        let template = null;
        switch (ui.draggable.attr('data-type')) {
            case 'variable':
                console.log('dropped into add plot', this.row, this.col);
                this.props.addPlot(ui.draggable.attr('data-name'), graphics_method_parent, graphics_method, template, this.props.row, this.props.col);
                break
            default:
                break
        }
        $('.cell-stack-bottom').removeClass('plotter-to-top');
    },
    componentDidMount(){
        this.initDrop();
        $('#add-plot-' + this.props.row + this.props.col).droppable({tolerance: 'pointer', drop: this.addPlot})
    },
    componentDidUpdate(){
        console.log('updating drop with', this.props.row, this.props.col)
        this.initDrop();
    },
    render() {
        console.log('this', this);
        console.log('plotter row col', this.props.row, this.props.col);
        return (
            <div className='cell-stack-bottom'>
                <div className='plotter-plots'>
                    {(() => {
                        let plotters = [];
                        for (var i = 0; i < this.props.cell.plots.length; i++) {
                            let plot = this.props.cell.plots[i];
                            plotters.push(<Plot key={i} plot={plot} plotIndex={i} swapVariableInPlot={this.props.swapVariableInPlot.bind(this, this.props.row, this.props.col)}/>)
                        }
                        return plotters;
                    })()}
                    <div className='plotter-add-plot' id={'add-plot-' + this.props.row + this.props.col}>
                        ADD plot
                    </div>
                </div>
            </div>
        )
    }
})

export default Plotter;
