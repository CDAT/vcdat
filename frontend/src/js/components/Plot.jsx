import React from 'react';
import {DropTarget} from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';


const plotTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        switch (monitor.getItemType()) {
            case DragAndDropTypes.GM:
                props.swapGraphicsMethodInPlot(item.gmType, item.gmName, props.plotIndex);
                break;
            case DragAndDropTypes.VAR:
                props.swapVariableInPlot(item.variable, props.plotIndex);
                break;
            case DragAndDropTypes.TMPL:
                props.swapTemplateInPlot(item.template, props.plotIndex);
                break;
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}


var Plot = React.createClass({
    propTypes: {
        plot: React.PropTypes.object,
        plotIndex: React.PropTypes.number,
        plotName: React.PropTypes.string,
        swapVariableInPlot: React.PropTypes.func,
        swapGraphicsMethodInPlot: React.PropTypes.func,
        swapTemplateInPlot: React.PropTypes.func,

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
    render() {
        return this.props.connectDropTarget(
            <div className='plot' id={this.props.plotName} data-plot-index={this.props.plotIndex}>
                <div>
                    <h4>Variables:</h4>
                    <div className='plot-var first-var'>{(this.props.plot.variables.length > 0
                            ? this.props.plot.variables[0].cdms_var_name
                            : '')}
                    </div>
                    <div className={'plot-var second-var ' + (this.isVector()
                            ? 'colored-second-var'
                            : '')}>
                                {(this.props.plot.variables.length > 1
                                    ? this.props.plot.variables[1].cdms_var_name
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

export default DropTarget(DragAndDropTypes.PLOT_COMPONENTS, plotTarget, collect)(Plot);
