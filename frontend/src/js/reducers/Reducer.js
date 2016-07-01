import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'

var default_sheet = {
    col_count: 1,
    row_count: 1
}

var default_project = {
    cur_sheet: 0,
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

const projectReducer = (state = default_project, action) => {
    switch(action.type){
        case 'ROW_COUNT_CHANGED':
        case 'COL_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state);
            console.log('new state', new_state);
            sheetReducer(new_state.sheets[new_state.cur_sheet], action)
            console.log('after', new_state);
            return new_state;
        default:
            return state;
    }
}

/*
Tree Structure:

projects:
    {

        name: project_object --has past present future--:
            {
                cur_sheet: 0,
                sheets:
                    [
                        sheet_object:
                            {
                                row_count: number
                                col_count: number
                            }
                    ]
            }
    }

*/


const reducers = combineReducers({
    projects: projectReducer
})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_VISIBILITY'])
})

export default undoableReducer
