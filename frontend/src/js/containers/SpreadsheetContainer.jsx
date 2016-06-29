import React from 'react'
import Cell from '../components/Cell.jsx'
import {connect} from 'react-redux'
import Actions from '../actions/Actions.js'

var Row = React.createClass({
    render() {
        var cols = [];
        for (var i = 0; i < this.props.colCount; i++) {
            cols.push(
                <td key={'col' + i}><Cell id={'cell' + this.props.row + i}/></td>
            )
        }
        return (
            <tr>
                {cols}
            </tr>
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
        this.props.rowCountChanged(event.target.value);
    },
    updateColCount(event) {
        this.props.rowCountChanged(event.target.value);
    },
    render() {
        var rows = [];
        for (var i = 0; i < this.props.row_count; i++) {
            rows.push(<Row key={'row' + i} colCount={this.props.col_count} row={i}/>);
        }
        console.log('rows', rows);
        return (
            <div id='spreadsheet-div'>
                <div>
                    <input type='number' id='spin-row' defaultValue={this.props.row_count} min='1' max='4' onChange={this.updateRowCount}/>
                    <input type='number' id='spin-column' defaultValue={this.props.col_count} min='1' max='4' onChange={this.updateColCount}/>
                </div>
                <div id='table-div'>
                    <table id='spreadsheet-table'>
                        <tbody id='spreadsheet-table-body'>
                            {rows}
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    return state.present.projects;
    // return {config: state.present.projects.config};
}

const mapDispatchToProps = (dispatch) => {
    return {
        rowCountChanged: (count) => dispatch(Actions.rowCountChanged(count)),
        colCountChanged: (count) => dispatch(Actions.colCountChanged(count))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetContainer);
