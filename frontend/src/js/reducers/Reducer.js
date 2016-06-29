import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'

var div = document.getElementById('spreadsheet-div');
var default_state = {
    col_count: 1,
    row_count: 1
}

const projectReducer = (state = default_state, action) => {
    console.log('reducing');
    switch(action.type){
        case 'ROW_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state, {row_count: action.count});
            return new_state;
        case 'COL_COUNT_CHANGED':
            var new_state = jQuery.extend(true, {}, state, {col_count: action.count});
            return new_state;
        default:
            return state;
    }
}


const reducers = combineReducers({
    projects: projectReducer
})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_VISIBILITY'])
})

export default undoableReducer
