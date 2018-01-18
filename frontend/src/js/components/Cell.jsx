import React from 'react';
import {connect} from 'react-redux';
import Actions from '../constants/Actions.js';
import Plotter from './Plotter.jsx';
import Canvas from './Canvas.jsx';
import {DropTarget} from 'react-dnd';
import PubSub from 'pubsub-js'
import PubSubEvents from '../constants/PubSubEvents.js'
import DragAndDropTypes from '../constants/DragAndDropTypes.js';


function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

const cellTarget = {};

class Cell extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            cell_id: undefined 
        }
    }
    componentDidMount(){
        this.token = PubSub.subscribe(PubSubEvents.clear_canvas, this.clearCanvas.bind(this))
    }
    selectCell(){
        if(this.props.selected_cell_id == this.state.cell_id){
            // this.props.deselectCell() // if a cell is selected, a user clicking on it should deselect it.
            // Turning this feature off since a user manipulating an interactive plot toggles the selection too much
            return
        }
        else{
            let date = new Date()
            let timestamp = date.getTime()
            this.setState({cell_id: timestamp})
            this.props.selectCell(timestamp)
        }
    }
    clearCanvas(){
        if(this.state.cell_id == this.props.selected_cell_id){
            this.refs.canvas.getWrappedInstance().clearCanvas()
            this.props.clearCell(this.props.row, this.props.col) // removes plot state from redux
        }
    }
    render() {
        this.cell = this.props.cells[this.props.row][this.props.col];
        this.row = this.props.row;
        this.col = this.props.col;
        this.class = this.state.cell_id == this.props.selected_cell_id ? 'cell cell-selected' : 'cell'
        return this.props.connectDropTarget(
            <div className={this.class} data-row={this.props.row} data-col={this.props.col} onClick={() => {this.selectCell()}}>
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
                <Canvas ref="canvas" onTop={!this.props.isOver} plots={this.cell.plots} row={this.props.row} col={this.props.col} />}
            </div>
        );
    }
}

Cell.propTypes = {
    cells: React.PropTypes.array,
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    addPlot: React.PropTypes.func,
    swapVariableInPlot: React.PropTypes.func,
    swapGraphicsMethodInPlot: React.PropTypes.func,
    swapTemplateInPlot: React.PropTypes.func,
    connectDropTarget: React.PropTypes.func,
    isOver: React.PropTypes.bool,
    selectCell: React.PropTypes.func,
    deselectCell: React.PropTypes.func,
    selected_cell_id: React.PropTypes.number,
    clearCell: React.PropTypes.func,
}

const mapStateToProps = (state) => {
    return {
        cells: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].cells,
        selected_cell_id: state.present.sheets_model.selected_cell_id
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
        },
        selectCell: function(cell_id){
            dispatch(Actions.selectCell(cell_id))
        },
        deselectCell: function(){
            dispatch(Actions.deselectCell())
        },
        clearCell: function(row, col){
            dispatch(Actions.clearCell(row, col))
        },
    }
}

export default DropTarget(DragAndDropTypes.PLOT_COMPONENTS, cellTarget, collect)(connect(mapStateToProps, mapDispatchToProps)(Cell));
