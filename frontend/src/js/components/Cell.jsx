import * as vcs from 'vcs';
import React from 'react'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'
import Plotter from './Plotter.jsx'
const _vcs = vcs;
// this should be moved to some sort of connection management component
const session = vcs.createSession('ws://localhost:8080/ws'); // hard coded server path :(

var Cell = React.createClass({
    resizeCells() {
        $('.cell-image').each((index, el) => {
            el = $(el);
            var height = el.parent().innerHeight();
            el.height(height);
            var border = el.next();
            border.outerHeight(height);
        })
        this.props.resizeHeader($('.cell-image')[0]);
    },
    componentDidMount() {
        let canvas, gm;
        this.resizeCells();
        var element = $('.cell')[0];
        new ResizeSensor(element, () => {
            this.resizeCells();
        });
        session.then((session) => {
            return vcs.init(this.refs.cellImage, session);
        }).then((_canvas) => {
            canvas = _canvas;
            return canvas.create('isofill', '');
        }).then((_gm) => {
            const varObj = {}; // real code will need to get a variable object from the session
            gm = _gm;
            canvas.plot(varObj, gm, 'default', 'vtkweb');
        });
    },
    render() {
        this.cell = this.props.cells[this.props.row][this.props.col];
        this.row = this.props.row;
        this.col = this.props.col;
        return (
            <div className='cell' data-row={this.props.row} data-col={this.props.col}>
                <Plotter cell={this.cell} row={this.props.row} col={this.props.col} addPlot={this.props.addPlot} swapVariableInPlot={this.props.swapVariableInPlot} swapGraphicsMethodInPlot={this.props.swapGraphicsMethodInPlot} swapTemplateInPlot={this.props.swapTemplateInPlot}/>
                <div className='cell-stack-top'>
                    <div className={'border border-' + this.props.row + this.props.col} ref='cellImage'></div>
                </div>
            </div>
        )
    }
});
const mapStateToProps = (state) => {
    return {
        cells: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].cells
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addPlot: (variable = null, graphics_method_parent = null, graphics_method = null, template = null, row, col) => dispatch(Actions.addPlot(variable, graphics_method_parent, graphics_method, template, row, col)),
        swapVariableInPlot: (row, col, value, index, var_being_changed = 0) => dispatch(Actions.swapVariableInPlot(value, row, col, index, var_being_changed)),
        swapGraphicsMethodInPlot: (row, col, graphics_method_parent, graphics_method, index) => dispatch(Actions.swapGraphicsMethodInPlot(graphics_method_parent, graphics_method, row, col, index)),
        swapTemplateInPlot: (row, col, value, index) => dispatch(Actions.swapTemplateInPlot(value, row, col, index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
