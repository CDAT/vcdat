import undoable, {
    distinctState,
    combineFilters,
    excludeAction
} from 'redux-undo'
import {
    combineReducers
} from 'redux'

var test_vars = ['clt', 'u', 'v'];

var test_gms = {
    'boxfill': ['a_boxfill', 'default'],
    'isofill': ['a_isofill', 'default'],
    'vector': ['default']
};

var test_temps = ['default', 'LLof4', 'bot_of_3'];

var default_cell = {
    plot_being_edited: 0,
    plots: [{
        variables: ['clt'], //testing inspector
        graphics_method_parent: 'boxfill',
        graphics_method: 'default',
        template: 'default'
    }]
}

var second_cell = {
    plot_being_edited: 0,
    plots: [{
        variables: ['u'], //testing inspector
        graphics_method_parent: 'isofill',
        graphics_method: 'default',
        template: 'default'
    }]
}

var default_sheet = {
    col_count: 1,
    row_count: 1,
    selected_cell_indices: [
        [-1, -1]
    ],
    cells: [
        [default_cell]
    ]

}

var default_sheets_model = {
    cur_sheet_index: 0,
    sheets: [default_sheet]
}

const moveRow = (cells, action) => {
    var item = cells.splice(action.dragged_index, 1)[0];

    if (action.position === 'top') {
        console.log('moving to top');
        cells.splice(action.dropped_index - 1, 0, item)
    } else {
        console.log('moving to bot');
        cells.splice(action.dropped_index, 0, item)
    }
}

const moveCol = (cells, action) => {
    cells.forEach((row, i) => {
        var item = row.splice(action.dragged_index, 1)[0];

        if (action.position === 'left') {
            console.log('moving to left');
            row.splice(action.dropped_index - 1, 0, item)
        } else {
            console.log('moving to right');
            row.splice(action.dropped_index, 0, item)
        }
    });
}

const createCellGrid = (sheet) => {
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
                col.push(second_cell);
            }
        }
        rows.push(col);
    }
    //update selected cells
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

const varListReducer = (state = test_vars, action) => {
    switch (action.type) {
        default: return state
    }
}

const gmListReducer = (state = test_gms, action) => {
    switch (action.type) {
        default: return state
    }
}

const templateListReducer = (state = test_temps, action) => {
    switch (action.type) {
        default: return state
    }
}

const updateCell = (cell, action) => {
    switch (action.type) {
        case 'CHANGE_PLOT_VAR':
            cell.plots[cell.plot_being_edited].variables[action.var_being_changed] = action.value;
            break
        case 'CHANGE_PLOT_GM':
            if (action.parent) {
                cell.plots[cell.plot_being_edited].graphics_method_parent = action.value;
                cell.plots[cell.plot_being_edited].graphics_method = 'default';
            } else {
                cell.plots[cell.plot_being_edited].graphics_method = action.value;
            }
            break
        case 'CHANGE_PLOT_TEMPLATE':
            cell.plots[cell.plot_being_edited].template = action.value;
            break
        default:
            break;
    }
}

const sheetsModelReducer = (state = default_sheets_model, action) => {
    switch (action.type) {
        case 'MOVE_ROW':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index];
            moveRow(sheet.cells, action);
            return new_state;
        case 'MOVE_COLUMN':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index];
            moveCol(sheet.cells, action);
            return new_state;
        case 'UPDATE_SELECTED_CELLS':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index];
            sheet.selected_cell_indices = action.selected_cells;
            return new_state;
        case 'CHANGE_PLOT_VAR':
        case 'CHANGE_PLOT_GM':
        case 'CHANGE_PLOT_TEMPLATE':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index];
            updateCell(sheet.cells[sheet.selected_cell_indices[0][0]][sheet.selected_cell_indices[0][1]], action)
            return new_state;
        case 'ROW_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[new_state.cur_sheet_index];
            sheet.row_count = action.count;
            sheet.cells = createCellGrid(sheet);
            return new_state;
        case 'COL_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[new_state.cur_sheet_index];
            sheet.col_count = action.count;
            sheet.cells = createCellGrid(sheet);
            return new_state;
        case 'ADD_SHEET':
            var new_state = jQuery.extend(true, {}, state);
            new_state.sheets.push(default_sheet);
            new_state.cur_sheet_index = new_state.sheets.length - 1;
            return new_state;
        case 'REMOVE_SHEET':
            var new_state = jQuery.extend(true, {}, state);
            if (action.sheet_index < new_state.cur_sheet_index) {
                new_state.cur_sheet_index -= 1;
            } else if ((action.sheet_index === new_state.cur_sheet_index) && new_state.cur_sheet_index === new_state.sheets.length - 1) {
                new_state.cur_sheet_index -= 1;
            }
            new_state.sheets.splice(action.sheet_index, 1);
            return new_state;
        case 'CHANGE_CUR_SHEET_INDEX':
            console.log('changing to sheet', action.index);
            var new_state = jQuery.extend(true, {}, state);
            new_state.cur_sheet_index = action.index;
            return new_state;
        default:
            return state;
    }
}

/*
Tree Structure:
    {
        variables: [],
        graphics_methods: [],
        templates: [],
        cur_sheet: 0,
        sheets_model:{
            cur_sheet_index: 0,
            sheets:[
                sheet_object:
                    {
                        row_count: number
                        col_count: number
                        selected_cell_indices: [[0,0]] <--[[-1, -1]] for none selected. length > 1 for multi select
                        cells: [                  <--two dim array row, col
                                    [
                                        {
                                            plot_being_edited: number
                                            plots: [{

                                                    variables: [],
                                                    template: temp,
                                                    graphics_method_parent: gmp
                                                    graphics_method: gm
                                                }]
                                        }
                                    ],
                                    []
                                ]
                    }
            ]
        }
    }

*/


const reducers = combineReducers({
    variables: varListReducer,
    graphics_methods: gmListReducer,
    templates: templateListReducer,
    sheets_model: sheetsModelReducer

})

const undoableReducer = undoable(reducers, {
    filter: excludeAction(['CHANGE_CUR_SHEET_INDEX', 'UPDATE_SELECTED_CELLS'])
})

export default undoableReducer
