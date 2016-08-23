import React from 'react'

var Plot = React.createClass({

    addToPlotter(event, ui) {
        switch (ui.draggable.attr('data-type')) {
            case 'variable':
                this.props.swapVariableInPlot(ui.draggable.attr('data-name'), this.props.plotIndex);
                break;
            case 'graphics_method':
                let parent = ui.draggable.attr('data-parent');
                let name = ui.draggable.attr('data-name');
                this.props.swapGraphicsMethodInPlot(parent, name, this.props.plotIndex)
                break
            case 'template':
                this.props.swapTemplateInPlot(ui.draggable.attr('data-name'), this.props.plotIndex);
            default:
                break;
        }
        $('.cell-stack-bottom').removeClass('plotter-to-top');
    },

    initDrop() {
        var plot = $(document.getElementById(this.props.plotName));
        plot.droppable({
            accept: '.draggable-list-item',
            tolerance: 'pointer',
            hoverClass: 'plot-hover',
            drop: this.addToPlotter,
        })

        plot.find('.second-var').droppable({
            accept: '.draggable-list-item',
            tolerance: 'pointer',
            over: (event, ui) => {
                if (!this.validSecondVar(event, ui)) {
                    return false;
                }
                plot.droppable("disable");
                plot.removeClass('plot-hover')
                $(event.target).addClass('second-var-highlight');
            },
            out: (event, ui) => {
                plot.addClass('plot-hover')
                plot.droppable("enable");
                $(event.target).removeClass('second-var-highlight');
            },
            drop: (event, ui) => {
                if (!this.validSecondVar(event, ui)) {
                    return false;
                }
                plot.droppable("enable");
                $(event.target).removeClass('second-var-highlight');
                $('.cell-stack-bottom').removeClass('plotter-to-top');
                this.props.swapVariableInPlot(ui.draggable.attr('data-name'), this.props.plotIndex, 1);
            }
        })
    },
    validSecondVar(event, ui) {
        if (ui.draggable.attr('data-type') === 'variable' && this.props.plot.graphics_method_parent === 'vector') {
            return true;
        }
        return false;
    },
    isVector(){
        if(this.props.plot.graphics_method_parent === 'vector'){
            return true;
        }
        return false;
    },
    componentDidMount(){
        this.initDrop();
    },
    render() {
        return (
            <div className='plot' id={this.props.plotName} data-plot-index={this.props.plotIndex}>
                <div>
                    <h4>Variables:</h4>
                    <div className='plot-var first-var'>{(this.props.plot.variables.length > 0
                            ? this.props.plot.variables[0]
                            : '')}
                    </div>
                    <div className={'plot-var second-var ' + (this.isVector()
                            ? 'colored-second-var'
                            : '')}>
                                {(this.props.plot.variables.length > 1
                                    ? this.props.plot.variables[1]
                                    : '')}
                    </div>
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
