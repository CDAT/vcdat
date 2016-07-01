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
        console.log('addsheet');
    },
    updateRowCount(event) {
        this.props.rowCountChanged(parseInt(event.target.value));
    },
    updateColCount(event) {
        this.props.colCountChanged(parseInt(event.target.value));
    },
    componentDidMount() {
        $('#spreadsheet-div').selectable({filter: '.cell'})
    },
    render() {
        console.log('props', this.props);
        var rows = [];
        for (var i = 0; i < this.props.row_count; i++) {
            rows.push(<Row key={'row' + i} colCount={this.props.col_count} row={i} className='row-element'/>);
        }
        return (
            <div >
                <div>
                    <button className='black' onClick={this.addSheet}>+</button>
                    <input type='number' id='spin-row' value={this.props.row_count} min='1' max='4' onChange={this.updateRowCount}/>
                    <input type='number' id='spin-column' value={this.props.col_count} min='1' max='4' onChange={this.updateColCount}/>
                    <ul id='sheet-list'>
                        <li><button className='black'>Sheet1</button></li>
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
    console.log(state.present.projects.sheets);
    return state.present.projects.sheets[state.present.projects.cur_sheet]
}

const mapDispatchToProps = (dispatch) => {
    return {
        rowCountChanged: (count) => dispatch(Actions.rowCountChanged(count)),
        colCountChanged: (count) => dispatch(Actions.colCountChanged(count))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
