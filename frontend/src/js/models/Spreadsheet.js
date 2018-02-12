import BaseModel from './BaseModel.js';

// sheetsModelReducer + helpers
var default_plot = {
    variables: [], // testing inspector
    graphics_method_parent: 'boxfill',
    graphics_method: 'default',
    template: 'default'
}

var default_cell = {
    plot_being_edited: 0,
    plots: [default_plot]
}

var default_sheet = {
    name: 'Sheet',
    col_count: 1,
    row_count: 1,
    selected_cell_indices: [
        [-1, -1]
    ],
    cells: [
        [default_cell]
    ],
    sheet_index: 0,
}

var default_sheets_model = {
    cur_sheet_index: 0,
    selected_cell_id: "none",
    sheets: [default_sheet],
}


class SpreadsheetModel extends BaseModel {
    static reduce(state=default_sheets_model, action) {
        let new_state;
        let sheet;
        switch (action.type) {
            case 'SHIFT_SHEET':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets.splice(action.old_position, 1)[0];
                new_state.sheets.splice(action.new_position, 0, sheet);
                new_state.cur_sheet_index = action.new_position;
                return new_state;
            case 'MOVE_ROW':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[state.cur_sheet_index];
                SpreadsheetModel.moveRow(sheet.cells, action);
                return new_state;
            case 'MOVE_COLUMN':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[state.cur_sheet_index];
                SpreadsheetModel.moveCol(sheet.cells, action);
                return new_state;
            case 'UPDATE_SELECTED_CELLS':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[state.cur_sheet_index];
                sheet.selected_cell_indices = action.selected_cells;
                return new_state;
            case 'ADD_PLOT':
            case 'CHANGE_PLOT':
            case 'CHANGE_PLOT_VAR':
            case 'CHANGE_PLOT_GM':
            case 'CHANGE_PLOT_TEMPLATE':
            case 'DELETE_PLOT_VAR':
            case 'DELETE_PLOT':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[state.cur_sheet_index];
                SpreadsheetModel.updateCell(SpreadsheetModel.getCell(sheet, action), action)
                return new_state;
            case 'ROW_COUNT_CHANGED':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[new_state.cur_sheet_index];
                sheet.row_count = action.count;
                sheet.cells = SpreadsheetModel.createCellGrid(sheet);
                return new_state;
            case 'COL_COUNT_CHANGED':
                new_state = jQuery.extend(true, {}, state);
                sheet = new_state.sheets[new_state.cur_sheet_index];
                sheet.col_count = action.count;
                sheet.cells = SpreadsheetModel.createCellGrid(sheet);
                return new_state;
            case 'ADD_SHEET':
                new_state = jQuery.extend(true, {}, state);
                sheet = jQuery.extend(true, {}, default_sheet);
                sheet.name += new_state.sheets.length;
                new_state.sheets.push(sheet);
                new_state.cur_sheet_index = new_state.sheets.length - 1;
                return new_state;
            case 'REMOVE_SHEET':
                new_state = jQuery.extend(true, {}, state);
                if (action.sheet_index < new_state.cur_sheet_index) {
                    new_state.cur_sheet_index -= 1;
                } else if ((action.sheet_index === new_state.cur_sheet_index)
                    && new_state.cur_sheet_index === new_state.sheets.length - 1) {
                    new_state.cur_sheet_index -= 1;
                }
                new_state.sheets.splice(action.sheet_index, 1);
                return new_state;
            case 'CHANGE_CUR_SHEET_INDEX':
                new_state = jQuery.extend(true, {}, state);
                new_state.cur_sheet_index = action.index;
                new_state.selected_cell_id = "none" // reset selected cell when changing sheets
                return new_state;
            case 'SELECT_CELL':
                new_state = jQuery.extend(true, {}, state);
                new_state.selected_cell_id = action.cell_id
                return new_state
            case 'DESELECT_CELL':
                new_state = jQuery.extend(true, {}, state);
                new_state.selected_cell_id = "none"
                return new_state
            case 'CLEAR_CELL':
                new_state = jQuery.extend(true, {}, state);
                new_state.sheets[new_state.cur_sheet_index].cells[action.row][action.col].plots = [{
                    graphics_method: "default",
                    graphics_method_parent: "boxfill",
                    template: "default",
                    variables: [],
                }]
                return new_state
            default:
                return state;
        }
    }

    static getInitialState() {
        return Promise.resolve(default_sheets_model);
    }

    static moveRow(cells, action) {
        var item = cells.splice(action.dragged_index, 1)[0];

        if (action.position === 'top') {
            cells.splice(action.dropped_index - 1, 0, item)
        } else {
            cells.splice(action.dropped_index, 0, item)
        }
    }

    static moveCol(cells, action) {
        cells.forEach((row, i) => {
            var item = row.splice(action.dragged_index, 1)[0];

            if (action.position === 'left') {
                row.splice(action.dropped_index - 1, 0, item)
            } else {
                row.splice(action.dropped_index, 0, item)
            }
        });
    }

    static createCellGrid(sheet) {
        var cells = sheet.cells;
        var row_count = sheet.row_count;
        var col_count = sheet.col_count;
        var rows = []
        for (var i = 0; i < row_count; i++) {
            let col = []
            for (var j = 0; j < col_count; j++) {
                if (i < cells.length && j < cells[i].length) {
                    col.push(cells[i][j]);
                } else {
                    col.push(default_cell);
                }
            }
            rows.push(col);
        }
        // update selected cells
        var new_arr = [];
        sheet.selected_cell_indices.forEach((value, index, arr) => {
            if (!value[0] >= row_count) {
                new_arr.push(value);
            }
            if (!value[1] >= col_count) {
                new_arr.push(val);
            }
        });
        if (new_arr.length < 1) {
            new_arr = [
                [-1, -1]
            ];
        }
        sheet.selected_cell_indices = new_arr;
        return rows
    }

    static updateCell(cell, action) {
        switch (action.type) {
            case 'CHANGE_PLOT':
                cell.plot_being_edited = action.value
                break
            case 'ADD_PLOT':
                var new_plot = jQuery.extend(true, {}, default_plot);
                if (action.variable) {
                    new_plot.variables.push(action.variable);
                }
                if (action.graphics_method){
                    new_plot.graphics_method_parent = action.graphics_method_parent;
                    new_plot.graphics_method = action.graphics_method;
                }
                if(action.template){
                    new_plot.template = action.template;
                }
                cell.plots.push(new_plot);
                break
            case 'CHANGE_PLOT_VAR':
                var plot = cell.plots[cell.plot_being_edited]
                if(action.plot_index){
                    plot = cell.plots[action.plot_index]
                }
                plot.variables[action.var_being_changed] = action.value;
                for(let [index, val] of plot.variables.entries()){
                    if(val === undefined){
                        plot.variables[index] = ""
                    }
                }
                break
            case 'CHANGE_PLOT_GM':
                var plot = cell.plots[cell.plot_being_edited]
                if(action.plot_index){
                    plot = cell.plots[action.plot_index]
                }
                if (action.graphics_method_parent) {
                    plot.graphics_method_parent = action.graphics_method_parent;
                    plot.graphics_method = 'default';

                    // remove second var if not vector
                    if(plot.graphics_method_parent !== 'vector'){
                        plot.variables.splice(1, 1);
                    }
                }
                if(action.graphics_method){
                    plot.graphics_method = action.graphics_method;
                }
                break
            case 'CHANGE_PLOT_TEMPLATE':
                var plot = cell.plots[cell.plot_being_edited]
                if(action.plot_index){
                    plot = cell.plots[action.plot_index]
                }
                plot.template = action.value;
                break
            case 'DELETE_PLOT_VAR':
                var plot = cell.plots[cell.plot_being_edited]
                if(action.plot_index){
                    plot = cell.plots[action.plot_index]
                }
                plot.variables.splice(action.var_index, 1)
                break
            case 'DELETE_PLOT':
                cell.plots.splice(action.index, 1)
                break
            default:
                break;
        }
    }

    static getCell(sheet, action) {
        if(action.row >= 0 && action.col >= 0)
            return sheet.cells[action.row][action.col]
        else{
            return sheet.cells[sheet.selected_cell_indices[0][0]][sheet.selected_cell_indices[0][1]]
        }
    }
}

export default SpreadsheetModel
