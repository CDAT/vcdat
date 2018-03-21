import React, { Component } from 'react'
import Plot from './Plot.jsx'
import {DropTarget} from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';


class AddPlot extends Component {
    constructor(props){
        super(props)
        this.state = {
            highlight: false,
        }
    }
    
    render(){
        return(
            this.props.connectDropTarget(
                <div className='plotter-add-plot'>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" onClick={this.props.handleClick}>
                        <circle 
                            cx="256"
                            cy="256"
                            r="224"
                            fill="none"
                            stroke={this.props.is_over && this.state.highlight ? "lime" : "black"}
                            strokeWidth="64"
                        />
                        <path 
                            fill={this.props.is_over && this.state.highlight ? "lime" : "black"}
                            d="M256,256 m-160,-32 l128,0 l0,-128 l64,0 l0,128 l128,0 l0,64 l-128,0 l0,128 l-64,0 l0,-128 l-128,0 z"
                        />
                    </svg>
                </div>
            )
        )
    }
}

AddPlot.propTypes = {
    connectDropTarget: React.PropTypes.func,
    is_over: React.PropTypes.bool,
    handleClick: React.PropTypes.func,
}

const addPlotTarget = {
    drop(props, monitor, component) {
        props.onDrop()
        const item = monitor.getItem();
        let var_name = null;
        let graphics_method_parent = null;
        let graphics_method = null;
        let template = null;
        let row = props.row;
        let col = props.col;

        switch (monitor.getItemType()) {
            case DragAndDropTypes.GM:
                graphics_method_parent = item.gmType;
                graphics_method = item.gmName;
                break;
            case DragAndDropTypes.VAR:
                var_name = item.variable;
                break;
            case DragAndDropTypes.TMPL:
                template = item.template;
                break;
        }
        component.setState({highlight: undefined}) 
        props.addPlot(var_name, graphics_method_parent, graphics_method, template, row, col);
    },
    hover(props, monitor, component){
        component.setState({highlight: true})
    }
};

const DropPlot = DropTarget(DragAndDropTypes.PLOT_COMPONENTS, addPlotTarget, collect)(AddPlot);

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        is_over: monitor.isOver(),
    };
}

/* global $*/

var Plotter = React.createClass({
    propTypes: {
        addPlot: React.PropTypes.func,
        row: React.PropTypes.number,
        col: React.PropTypes.number,
        cell: React.PropTypes.object,
        swapTemplateInPlot: React.PropTypes.func,
        swapVariableInPlot: React.PropTypes.func,
        swapGraphicsMethodInPlot: React.PropTypes.func,
        onDrop: React.PropTypes.func,
    },
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
                    <DropPlot onHover={this.props.onHover} onDrop={this.props.onDrop} addPlot={this.props.addPlot} row={this.props.row} col={this.props.col}/>
                </div>
            </div>
        )
    }
})

export default Plotter;
