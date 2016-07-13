import React from 'react'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'

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
        this.resizeCells();
        var element = $('.cell')[0];
        new ResizeSensor(element, () => {
            this.resizeCells();
        })
        $('.cell-stack-bottom').droppable({
            over: (event, ui) => {
                $(event.target).addClass('plotter-to-top');
            },
            out: (event, ui) => {
                $(event.target).removeClass('plotter-to-top');
            }
        })
        console.log('row, col', this.props.row, this.props.col);
        $('.plotter').droppable({
            tolerance: 'pointer',
            hoverClass: 'plotter-to-top',
            drop: (event, ui) => {


                console.log('event target', event.target, $(event.target).attr('key'))
                switch (ui.draggable.attr('data-type')) {
                    case 'variable':
                        this.props.addVariableToPlot(ui.draggable.attr('data-name'), this.props.row, this.props.col, parseInt($(event.target).attr('data-plot-index')));
                        break;
                    default:
                        break;
                }
                $(event.target).parent().parent().removeClass('plotter-to-top');
            }
        })
        $('.plotter-add-plot').droppable({
            tolerance: 'pointer',

            drop: (event, ui) => {
                console.log(ui.draggable.attr('data-type'));
                let variable = null;
                let graphics_method_parent = null;
                let graphics_method = null;
                let template = null;
                switch (ui.draggable.attr('data-type')) {
                    case 'variable':
                        this.props.addPlot(ui.draggable.attr('data-name'), graphics_method_parent, graphics_method, template, this.props.row, this.props.col);
                        break
                    default:
                        break
                }
                console.log('removing top class');
                $(event.target).parent().removeClass('plotter-to-top');
            }
        })
    },
    render() {
        this.cell = this.props.cells[this.props.row][this.props.col];
        console.log('this.cell', this.cell);
        return (
            <div className='cell' data-row={this.props.row} data-col={this.props.col}>
                <div className='cell-stack-bottom'>
                    <div className='plotter-plots'>
                        {(() => {
                            let plotters = [];
                            for (var i = 0; i < this.cell.plots.length; i++) {
                                let plot = this.cell.plots[i];
                                plotters.push(
                                    <div className='plotter' data-plot-index={i} key={'plotter' + i}>
                                        <div>
                                            <h3>Variables:</h3>
                                            {(plot.variables.length > 0 ? [plot.variables]: [])}
                                        </div>
                                        <div>
                                            <h3>Graphics method:</h3>
                                            <h5>{plot.graphics_method_parent}</h5>
                                            <h5>{plot.graphics_method}</h5>
                                        </div>
                                        <div>
                                            <h3>Template:</h3>
                                            <h5>{plot.template}</h5>
                                        </div>
                                    </div>
                                )
                            }
                            return plotters;
                        })()}
                    </div>
                    <div className='plotter-add-plot'>
                        ADD plot
                    </div>
                </div>
                <div className='cell-stack-top'>
                    <img className='cell-image' src='deps/clt_image.png' alt='climate_data'></img>
                    <div className='border'></div>
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
        addVariableToPlot: (variable, row, col, index) => dispatch(Actions.addVariableToPlot(variable, row, col, index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);

// <i className='glyphicon glyphicon-plus-sign'></i>
