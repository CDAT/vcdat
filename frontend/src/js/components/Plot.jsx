import React from 'react'

var Plot = React.createClass({

    addToPlotter(event, ui) {
        switch (ui.draggable.attr('data-type')) {
            case 'variable':
                this.props.swapVariableInPlot(this.props.row, this.props.col, ui.draggable.attr('data-name'), this.props.plotIndex);
                break;
            default:
                break;
        }
        $('.cell-stack-bottom').removeClass('plotter-to-top');
    },

    initDrop() {
        $('.plotter').droppable({tolerance: 'pointer', drop: this.addToPlotter})

        $('.second-var').droppable({
            greedy: true,
            over: (event, ui) => {
                if (!this.validSecondVar(event, ui)) {
                    return false;
                }
                $(event.target).addClass('second-var-highlight');
            },
            out: (event, ui) => {
                $(event.target).removeClass('second-var-highlight');
            },
            drop: (event, ui) => {
                if (!this.validSecondVar(event, ui)) {
                    return false;
                }
                $(event.target).removeClass('second-var-highlight');
                $('.cell-stack-bottom').removeClass('plotter-to-top');
                this.props.swapVariableInPlot(ui.draggable.attr('data-name'), this.props.plotIndex, true);
            }
        })
    },
    componentDidMount(){
        this.initDrop();
    },
    render() {
        return (
            <div className='plotter' data-plot-index={this.props.plotIndex}>
                <div>
                    <h4>Variables:</h4>
                    <div className='plotter-var'>{(this.props.plot.variables.length > 0
                            ? this.props.plot.variables[0]
                            : '')}</div>
                    <div className='plotter-var second-var'>{(this.props.plot.variables.length > 1
                            ? this.props.plot.variables[1]
                            : '')}</div>
                </div>
                <div>
                    <h4>Graphics method:</h4>
                    <h5>{this.props.plot.graphics_method_parent}</h5>
                    <h5>{this.props.plot.graphics_method}</h5>
                </div>
                <div>
                    <h4>Template:</h4>
                    <h5>{this.props.plot.template}</h5>
                </div>
            </div>
        )
    }
})

export default Plot;
