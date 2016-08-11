
import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux';
import Actions from '../actions/Actions.js';
import {getStore} from '../Store.js';


var test_vars = ['clt', 'u', 'v'];

var default_plot = {
    variables: [], //testing inspector
    graphics_method_parent: 'boxfill',
    graphics_method: 'default',
    template: 'default'
}

var default_cell = {
    plot_being_edited: 0,
    plots: [default_plot]
}

var second_cell = {
    plot_being_edited: 0,
    plots: [{
        variables: [], //testing inspector
        graphics_method_parent: 'isofill',
        graphics_method: 'default',
        template: 'default'
    }]
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
    ]

}

var default_sheets_model = {
    cur_sheet_index: 0,
    sheets: [default_sheet]
}

const moveRow = (cells, action) => {
    var item = cells.splice(action.dragged_index, 1)[0];

    if (action.position === 'top') {
        cells.splice(action.dropped_index - 1, 0, item)
    } else {
        cells.splice(action.dropped_index, 0, item)
    }
}

const moveCol = (cells, action) => {
    cells.forEach((row, i) => {
        var item = row.splice(action.dragged_index, 1)[0];

        if (action.position === 'left') {
            row.splice(action.dropped_index - 1, 0, item)
        } else {
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

const gmListReducer = (state = {}, action) => {
    if (!Object.keys(state).length && action.type != 'INITIALIZE_GRAPHICS_METHODS_VALUES'){
        getGraphicsMethods();
    }
    switch (action.type) {
        case "INITIALIZE_GRAPHICS_METHODS_VALUES":
            return action.graphics_methods;
        default:
            return state
    }
}

const getGraphicsMethods = () => {
    $.get("getGraphicsMethods").then(
        function(gm){
            getStore().dispatch(Actions.initializeGraphicsMethodsValues(JSON.parse(gm)))
        }
    )
}
const templateListReducer = (state = [], action) => {
    if (!state.length && action.type != 'INITIALIZE_TEMPLATE_VALUES'){
        getTemplates();
    }
    switch (action.type) {
        case 'INITIALIZE_TEMPLATE_VALUES':
            return action.templates;
        default:
            return state
    }
}

const getTemplates = () => {
    $.get("getTemplates").then(
        function(templates){
            getStore().dispatch(Actions.initializeTemplateValues(JSON.parse(templates)));
        }
    );
}

const updateCell = (cell, action) => {
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
            break
        case 'CHANGE_PLOT_GM':
            var plot = cell.plots[cell.plot_being_edited]
            if(action.plot_index){
                plot = cell.plots[action.plot_index]
            }
            if (action.graphics_method_parent) {
                plot.graphics_method_parent = action.graphics_method_parent;
                plot.graphics_method = 'default';

                //remove second var if not vector
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
        default:
            break;
    }
}

const getCell = (sheet, action) => {
    if(action.row >= 0 && action.col >= 0)
        return sheet.cells[action.row][action.col]
    else{
        return sheet.cells[sheet.selected_cell_indices[0][0]][sheet.selected_cell_indices[0][1]]
    }
}

const sheetsModelReducer = (state = default_sheets_model, action) => {
    switch (action.type) {
        case 'SHIFT_SHEET':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets.splice(action.old_position, 1)[0];
            new_state.sheets.splice(action.new_position, 0, sheet);
            new_state.cur_sheet_index = action.new_position;
            return new_state;
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
        case 'ADD_PLOT':
        case 'CHANGE_PLOT':
        case 'CHANGE_PLOT_VAR':
        case 'CHANGE_PLOT_GM':
        case 'CHANGE_PLOT_TEMPLATE':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index];
            updateCell(getCell(sheet, action), action)
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
            var sheet = jQuery.extend(true, {}, default_sheet);
            sheet.name += new_state.sheets.length;
            new_state.sheets.push(sheet);
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
            var new_state = jQuery.extend(true, {}, state);
            new_state.cur_sheet_index = action.index;
            return new_state;
        default:
            return state;
    }
}

const reducers = combineReducers({
    variables: varListReducer,
    graphics_methods: gmListReducer,
    templates:templateListReducer,
    sheets_model: sheetsModelReducer

})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_CUR_SHEET_INDEX', 'INITIALIZE_TEMPLATE_VALUES', 'INITIALIZE_GRAPHICS_METHODS_VALUES'])
})

export default undoableReducer

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