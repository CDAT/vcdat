import React from 'react'
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'

var Row = React.createClass({
    render() {
        var cols = [];
        for (var i = 0; i < this.props.colCount; i++) {
            cols.push(
                <div className='spreadsheet-col' key={'col' + i}><Cell id={'cell' + this.props.row + i}/></div>
            )
        }
        return (
            <div className='spreadsheet-row'>
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
        $('#spreadsheet-div').selectable({filter: '.cell'})
        $('#spreadsheet-container').resizable({
            handles: 'e, w',
            minWidth: 500
        })
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
                <div>
                    <input type='number' id='spin-row' value={this.row_count} min='1' max='4' onChange={this.updateRowCount}/>
                    <input type='number' id='spin-column' value={this.col_count} min='1' max='4' onChange={this.updateColCount}/>
                    <button className='btn' onClick={this.addSheet}><i className='material-icons'>add</i></button>
                    <ul id='sheet-list'>
                        {this.props.sheets.map((item, index) => {
                            return(
                                <li className='sheet-list-item' key={'Sheet' + (index+1)}>
                                    <button onClick={this.changeCurSheetIndex.bind(this, index)} className={'btn ' + (index === this.props.cur_sheet_index ? 'teal accent-3': '')}>{'Sheet' + (index+1)}</button>
                                </li>)
                        })}
                    </ul>
                </div>
                <div id='spreadsheet-div'>
                    {rows}
                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    return {
        sheets: state.present.projects.sheets,
        cur_sheet: state.present.projects.sheets[state.present.projects.cur_sheet_index],
        cur_sheet_index: state.present.projects.cur_sheet_index
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        rowCountChanged: (count) => dispatch(Actions.rowCountChanged(count)),
        colCountChanged: (count) => dispatch(Actions.colCountChanged(count)),
        addSheet: () => dispatch(Actions.addSheet()),
        changeCurSheetIndex: (index) => dispatch(Actions.changeCurSheetIndex(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
