import React from 'react';
import {connect} from 'react-redux';
import Actions from '../constants/Actions.js';
import Plotter from './Plotter.jsx';
import Canvas from './Canvas.jsx';
import {DropTarget} from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';



function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

const cellTarget = {};

var Cell = React.createClass({
    propTypes: {
        cells: React.PropTypes.array,
        row: React.PropTypes.number,
        col: React.PropTypes.number,
        addPlot: React.PropTypes.func,
        swapVariableInPlot: React.PropTypes.func,
        swapGraphicsMethodInPlot: React.PropTypes.func,
        swapTemplateInPlot: React.PropTypes.func,
        connectDropTarget: React.PropTypes.func,
        isOver: React.PropTypes.bool,
    },
    render() {
        this.cell = this.props.cells[this.props.row][this.props.col];
        this.row = this.props.row;
        this.col = this.props.col;
        return this.props.connectDropTarget(
            <div className='cell' data-row={this.props.row} data-col={this.props.col}>
                <Plotter
                    onTop={this.props.isOver}
                    cell={this.cell}
                    row={this.props.row}
                    col={this.props.col}
                    addPlot={this.props.addPlot}
                    swapVariableInPlot={this.props.swapVariableInPlot}
                    swapGraphicsMethodInPlot={this.props.swapGraphicsMethodInPlot}
                    swapTemplateInPlot={this.props.swapTemplateInPlot}
                />
                <Canvas onTop={!this.props.isOver} plots={this.cell.plots} row={this.props.row} col={this.props.col} />}
            </div>
        );
    }
});
const mapStateToProps = (state) => {
    return {
        cells: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].cells
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addPlot: function(variable=null, graphics_method_parent=null, graphics_method=null, template=null, row, col) {
            dispatch(Actions.addPlot(variable, graphics_method_parent, graphics_method, template, row, col));
        },
        swapVariableInPlot: function(row, col, value, index, var_being_changed=0) {
            dispatch(Actions.swapVariableInPlot(value, row, col, index, var_being_changed));
        },
        swapGraphicsMethodInPlot: function(row, col, graphics_method_parent, graphics_method, index) {
            dispatch(Actions.swapGraphicsMethodInPlot(graphics_method_parent, graphics_method, row, col, index));
        },
        swapTemplateInPlot: function(row, col, value, index) {
            dispatch(Actions.swapTemplateInPlot(value, row, col, index));
        }
    }
}

export default DropTarget(DragAndDropTypes.PLOT_COMPONENTS, cellTarget, collect)(connect(mapStateToProps, mapDispatchToProps)(Cell));
