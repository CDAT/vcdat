import React from 'react'
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'

var Row = React.createClass({
    render() {
        var cols = [];
        for (var i = 0; i < this.props.colCount; i++) {
            cols.push(
                <div className='spreadsheet-col' key={'col' + i}><Cell row={this.props.row} col={i}/></div>
            )
        }
        return (
            <div className='spreadsheet-row'>
                <div className='draggable-head'></div>
                {cols}
            </div>
        )
    }
})

var SpreadsheetContainer = React.createClass({
    getInitialState() {
        return {};
    },
    addSheet() {
        this.props.addSheet();
    },
    updateRowCount(event) {
        if (event.target.value < 1 || event.target.value > 4){
            event.target.value = '';
            return;
        }
        this.props.rowCountChanged(parseInt(event.target.value));
    },
    updateColCount(event) {
        if (event.target.value < 1 || event.target.value > 4){
            event.target.value = '';
            return;
        }
        this.props.colCountChanged(parseInt(event.target.value));
    },
    changeCurSheetIndex(index){
        this.props.changeCurSheetIndex(index);
    },
    componentDidMount() {
        $('#spreadsheet-div').selectable({
            filter: '.cell',
            stop: this.updateSelectedCells
        })

    },
    updateSelectedCells(event, ui){
        var selected_cells = [];
        $(event.target).find('.ui-selected').each((integer, value) => {
            var value = $(value);
            var row = value.attr('data-row');
            var col = value.attr('data-col');
            selected_cells.push([row, col]);
        })
        if (selected_cells.length === 0){
            selected_cells = [[-1, -1]];
        }
        this.props.updateSelectedCells(selected_cells);
    },
    removeSheet(index, event){
        event.stopPropagation();
        this.props.removeSheet(index)
    },
    render() {
        this.row_count = this.props.cur_sheet.row_count;
        this.col_count = this.props.cur_sheet.col_count;
        var rows = [];
        for (var i = 0; i < this.row_count; i++) {
            rows.push(<Row key={'row' + i} colCount={this.col_count} row={i} className='row-element'/>);
        }
        return (
            <div id='spreadsheet-container'>
                <div id='spreadsheet-toolbar'>
                    <input type='number' id='spin-row' value={this.row_count} min='1' max='4' onChange={this.updateRowCount}/>
                    <input type='number' id='spin-column' value={this.col_count} min='1' max='4' onChange={this.updateColCount}/>
                    <button className='btn btn-default' id='add-sheet-button' onClick={this.addSheet}><i className='glyphicon glyphicon-plus'></i></button>
                    <ul id='sheet-list' className='nav nav-tabs'>
                        {this.props.sheets.map((item, index) => {
                            return(
                                <li role='presentation' className={'sheet-list-item ' + (index === this.props.cur_sheet_index ? 'active': '')}  key={'Sheet' + (index+1)}>
                                    <a onClick={this.changeCurSheetIndex.bind(this, index)}>{'Sheet' + (index+1)}<button onClick={this.removeSheet.bind(this, index)} className="close" disabled={!this.props.remove_enabled} type="button">×</button></a>
                                </li>)
                        })}
                    </ul>
                </div>
                <div id='spreadsheet-div' className=''>
                    {rows}
                </div>
            </div>
        )
    }
});

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
        updateSelectedCells: (selected_cells) => dispatch(Actions.updateSelectedCells(selected_cells))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
