import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'

const projectReducer = (state = {}, action) => {
    switch(action.type){
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
