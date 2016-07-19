import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'

var test_vars = ['clt', 'u', 'v'];

var test_gms = {
    'boxfill': ['a_boxfill', 'default'],
    'isofill': ['a_isofill', 'default'],
    'vector': ['default']
};

var test_temps = ['default', 'LLof4', 'bot_of_3'];

var default_cell = {
    plot_being_edited:0,
    plots:
        [{
            variables: ['clt'],              //testing inspector
            graphics_method_parent: 'boxfill',
            graphics_method: 'default',
            template: 'default'
        }]
}

var default_sheet = {
    col_count: 1,
    row_count: 1,
    selected_cell_indices: [[0,0]],
    cells: [[default_cell]]

}

var default_sheets_model = {
    cur_sheet_index: 0,
    sheets: [default_sheet]
}

const sheetReducer = (sheet = default_sheet, action) => {
    switch(action.type){
        case 'ROW_COUNT_CHANGED':
            sheet.row_count = action.count;
            break;
        case 'COL_COUNT_CHANGED':
            sheet.col_count = action.count;
            break;
    }
}

const varListReducer = (state = test_vars, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const gmListReducer = (state = test_gms, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const templateListReducer = (state = getTemplates(), action) => {
    switch (action.type) {
        default:
            return state
    }
}

const getTemplates  = () => {
    //var templates = ['one', 'two', 'there']
    $.get("getTemplates").then(
        function(templates){
            return templates;
        }
    );
}



const updateCell = (cell, action) => {
    switch(action.type){
        case 'CHANGE_PLOT_VAR':
            cell.plots[cell.plot_being_edited].variables[action.var_being_changed] = action.value;
            break
        case 'CHANGE_PLOT_GM':
            if(action.parent){
                cell.plots[cell.plot_being_edited].graphics_method_parent = action.value;
                cell.plots[cell.plot_being_edited].graphics_method = 'default';
            }
            else{
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
    switch(action.type){
        case 'CHANGE_PLOT_VAR':
        case 'CHANGE_PLOT_GM':
        case 'CHANGE_PLOT_TEMPLATE':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[state.cur_sheet_index]
            updateCell(sheet.cells[sheet.selected_cell_indices[0][0]][sheet.selected_cell_indices[0][1]], action)
            return new_state;
        case 'ROW_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[new_state.cur_sheet_index];
            sheet.row_count = action.count;
            return new_state;
        case 'COL_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state);
            var sheet = new_state.sheets[new_state.cur_sheet_index];
            sheet.col_count = action.count;
            return new_state;
        case 'ADD_SHEET':
            var new_state = jQuery.extend(true, {}, state);
            new_state.sheets.push(default_sheet);
            new_state.cur_sheet_index = new_state.sheets.length-1;
            return new_state;
        case 'REMOVE_SHEET':
            var new_state = jQuery.extend(true, {}, state);
            if (action.sheet_index < new_state.cur_sheet_index){
                new_state.cur_sheet_index -= 1;
            }
            else if ((action.sheet_index === new_state.cur_sheet_index) && new_state.cur_sheet_index === new_state.sheets.length-1){
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
    templates:templateListReducer,
    sheets_model: sheetsModelReducer

})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_CUR_SHEET_INDEX'])
})

export default undoableReducer
