import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

import Cell from '../../components/Cell.jsx'
import { connect } from 'react-redux'
import Actions from '../../constants/Actions.js'
import Spinner from '../../components/Spinner/Spinner.jsx'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../constants/PubSubEvents.js'
import './SpreadsheetContainer.scss'
/* global $ */

class RenderRow extends Component {
    
    render() {
        var cols = [];
        for (var i = 0; i < this.props.colCount; i++) {
            cols.push(
                <div className='spreadsheet-col' key={'col' + i}>
                    {(() => {
                        if (this.props.row === 0) {
                            return (
                                <div className={'draggable-head ' + (i !== 0
                                    ? 'head-left-border'
                                    : '')} data-col={i}>
                                    <div className='droppable-head' data-position='left'>LEFT</div>
                                    <div className='droppable-head' data-position='right'>RIGHT</div>
                                </div>
                            )
                        }
                        return;
                    })()}
                    <Cell
                        resizeHeader={this.props.resizeHeader}
                        row={this.props.row}
                        col={i}
                        sheet_index={this.props.sheet_index}
                    />
                </div>
            )
        }
        return (
            <div className='spreadsheet-row'>
                <div className='row-header-container'>
                    {(() => {
                        if (this.props.row === 0) {
                            return (
                                <div className='header-spacer'></div>
                            );
                        }

                        return;
                    })()}
                    <div className='draggable-head' data-row={this.props.row}>
                        <div className='droppable-head' data-position='top'>TOP</div>
                        <div className='droppable-head' data-position='bottom'>BOT</div>
                    </div>
                </div>
                {cols}
            </div>
        )
    }
}

RenderRow.propTypes = {
    col: PropTypes.number,
    colCount: PropTypes.number,
    resizeHeader: PropTypes.func,
    row: PropTypes.number,
    sheet_index: PropTypes.number,
}

class SpreadsheetContainer extends Component {
    constructor(props){
        super(props)
        this.state = {}
        this.addSheet = this.addSheet.bind(this)
        this.updateRowCount = this.updateRowCount.bind(this)
        this.updateColCount = this.updateColCount.bind(this)
        this.changeCurSheetIndex = this.changeCurSheetIndex.bind(this)
        this.dropppedColHeader = this.dropppedColHeader.bind(this)
        this.dropppedRowHeader = this.dropppedRowHeader.bind(this)
        this.updateSelectedCells = this.updateSelectedCells.bind(this)
        this.removeSheet = this.removeSheet.bind(this)
    }

    addSheet() {
        this.props.addSheet();
    }

    updateRowCount(value) {
        this.props.rowCountChanged(value, 10);
    }

    updateColCount(value) {
        this.props.colCountChanged(value, 10);
    }

    changeCurSheetIndex(index) {
        this.props.changeCurSheetIndex(index);
    }

    initDragAndDrop() {
        // col rearrange
        $(".spreadsheet-col .draggable-head").draggable({
            axis: 'x',
            opacity: 0.7,
            helper: 'clone',
            start: (event, ui) => {
                ui.helper.css('background-color', 'white');
            },
            stop: (event, ui) => {
                ui.helper.css('background-color', 'black');
            }
        });

        $(".spreadsheet-col .droppable-head").droppable({
            accept: ".spreadsheet-col .draggable-head",
            tolerance: 'intersect',
            over: this.overColDroppable,
            out: this.outColDroppable,
            drop: this.dropppedColHeader
        });

        // row rearrange
        $(".row-header-container .draggable-head").draggable({
            axis: 'y',
            opacity: 0.7,
            helper: 'clone',
            start: (event, ui) => {
                ui.helper.css('background-color', 'white');
            },
            stop: (event, ui) => {
                ui.helper.css('background-color', 'black');
            }
        });
        $(".row-header-container .droppable-head").droppable({
            accept: ".row-header-container .draggable-head",
            tolerance: 'intersect',
            over: this.overRowDroppable,
            out: this.outRowDroppable,
            drop: this.dropppedRowHeader
        });

        // sortable for sheet tabs
        $('#sheet-list').sortable({
            helper: 'clone',
            start: (event, ui) => {
                ui.item.attr('data-previndex', ui.item.index());
                ui.helper.width(ui.helper.width() + 1)
            },
            stop: (event, ui) => {
                ui.item.parent().sortable('cancel');
            },
            update: (event, ui) => {
                var oldIndex = ui.item.attr('data-previndex');
                ui.item.removeAttr('data-previndex');
                this.props.shiftSheet(oldIndex, ui.item.index());
            }
        }
        );
    }

    overColDroppable(event, ui) {
        let col = $(event.target).parent().attr('data-col');
        if ($(event.target).attr('data-position') === 'left') {
            col -= 1
        }
        $(':regex(class, border-[0-9]' + col.toString() + ')').css('background-color', '#A3E2F7');
    }

    outColDroppable(event, ui) {
        let col = $(event.target).parent().attr('data-col');
        if ($(event.target).attr('data-position') === 'left') {
            col -= 1
        }
        $(':regex(class, border-[0-9]' + col.toString() + ')').css('background-color', 'transparent');
    }

    overRowDroppable(event, ui) {
        let row = $(event.target).parent().attr('data-row');
        if ($(event.target).attr('data-position') === 'top') {
            row -= 1
        }
        $(':regex(class, border-' + row.toString() + '[0-9])').css('background-color', '#A3E2F7');
    }

    outRowDroppable(event, ui) {
        let row = $(event.target).parent().attr('data-row');
        if ($(event.target).attr('data-position') === 'top') {
            row -= 1
        }
        $(':regex(class, border-' + row.toString() + '[0-9])').css('background-color', 'transparent');
    }

    componentDidMount() {
        // $('#spreadsheet-div').selectable({filter: '.cell', stop: this.updateSelectedCells});
        this.initDragAndDrop();
    }

    componentDidUpdate(prevProps) {
        this.initDragAndDrop();
        if(prevProps.cur_sheet.row_count != this.props.cur_sheet.row_count || prevProps.cur_sheet.col_count != this.props.cur_sheet.col_count){
            PubSub.publish(PubSubEvents.resize)
        }
    }

    dropppedColHeader(event, ui) {
        var dragged_index = ui.draggable.attr('data-col');
        var dropped_index = $(event.target).parent().attr('data-col');
        var dropped_position = $(event.target).attr('data-position');
        $('.border').css('background-color', 'transparent');
        this.props.moveColumn(dragged_index, dropped_index, dropped_position);
    }

    dropppedRowHeader(event, ui) {
        var dragged_index = ui.draggable.attr('data-row');
        var dropped_index = $(event.target).parent().attr('data-row');
        var dropped_position = $(event.target).attr('data-position');
        $('.border').css('background-color', 'transparent');
        this.props.moveRow(dragged_index, dropped_index, dropped_position);
    }

    resizeHeader(el) {
        $(".spreadsheet-col .draggable-head").each((index, element) => {
            $(element).width($(el).width());
        })
        $(".row-header-container .draggable-head").each((index, element) => {
            $(element).height($(el).height());
        })
    }

    updateSelectedCells(event, ui) {
        var selected_cells = [];
        $(event.target).find('.ui-selected').each((integer, value) => {
            var value = $(value);
            var row = Number.parseInt(value.attr('data-row'));
            var col = Number.parseInt(value.attr('data-col'));
            selected_cells.push([row, col]);
        })
        if (selected_cells.length === 0) {
            selected_cells = [
                [-1, -1]
            ];
        }
        this.props.updateSelectedCells(selected_cells);
    }

    removeSheet(index, event) {
        event.stopPropagation();
        this.props.removeSheet(index)
    }

    render() {
        let rowCount = this.props.cur_sheet.row_count;
        let colCount = this.props.cur_sheet.col_count;
        var rows = [];
        for (var i = 0; i < rowCount; i++) {
            rows.push(
                <RenderRow
                    resizeHeader={this.resizeHeader}
                    key={'row' + i}
                    sheet_index={this.props.cur_sheet_index}
                    colCount={colCount}
                    row={i}
                    className='row-element'
                />
            );
        }
        return (
            <div className='spreadsheet-container'>
                <div className="spreadsheet-toolbar form-inline">
                    <Spinner min={1} max={4} value={rowCount} update={this.updateRowCount} addon_label="Rows"/>
                    <Spinner min={1} max={4} value={colCount} update={this.updateColCount} addon_label="Cols"/>
                    <Button bsStyle="default" bsSize="small" className='add-sheet-button' onClick={this.addSheet}>
                        <i className='glyphicon glyphicon-plus'></i>
                    </Button>
                    <ul className='nav nav-tabs sheet-list'>
                        {this.props.sheets.map((item, index) => {
                            return (
                                <li role='presentation'
                                    className={
                                        'sheet-list-item ' + (index === this.props.cur_sheet_index
                                            ? 'active'
                                            : '')
                                    }
                                    key={'Sheet' + (index + 1)}>
                                    <a onClick={this.changeCurSheetIndex.bind(this, index)}>
                                        <span>{item.name}</span>
                                        <button onClick={this.removeSheet.bind(this, index)} className="close"
                                            disabled={!this.props.remove_enabled} type="button">×</button>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='spreadsheet-div'>{rows}</div>
            </div>
        )
    }
}

SpreadsheetContainer.propTypes = {
    addSheet: PropTypes.func,
    changeCurSheetIndex: PropTypes.func,
    colCountChanged: PropTypes.func,
    cur_sheet: PropTypes.object,
    cur_sheet_index: PropTypes.number,
    moveColumn: PropTypes.func,
    moveRow: PropTypes.func,
    remove_enabled: PropTypes.bool,
    removeSheet: PropTypes.func,
    rowCountChanged: PropTypes.func,
    sheets: PropTypes.array,
    shiftSheet: PropTypes.func,
    updateColCount: PropTypes.func,
    updateRowCount: PropTypes.func,
    updateSelectedCells: PropTypes.func
}

const mapStateToProps = (state) => {
    return {
        sheets: state.present.sheets_model.sheets,
        cur_sheet: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index],
        cur_sheet_index: state.present.sheets_model.cur_sheet_index,
        remove_enabled: state.present.sheets_model.sheets.length > 1
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        rowCountChanged: (count) => dispatch(Actions.rowCountChanged(count)),
        colCountChanged: (count) => dispatch(Actions.colCountChanged(count)),
        addSheet: () => dispatch(Actions.addSheet()),
        changeCurSheetIndex: (index) => dispatch(Actions.changeCurSheetIndex(index)),
        removeSheet: (index) => dispatch(Actions.removeSheet(index)),
        updateSelectedCells: (selected_cells) => dispatch(Actions.updateSelectedCells(selected_cells)),
        moveColumn: function (dragged_index, dropped_index, position) {
            dispatch(Actions.moveColumn(dragged_index, dropped_index, position));
        },
        moveRow: function (dragged_index, dropped_index, position) {
            dispatch(Actions.moveRow(dragged_index, dropped_index, position));
        },
        shiftSheet: (old_position, new_position) => dispatch(Actions.shiftSheet(old_position, new_position))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
