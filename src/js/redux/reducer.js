import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'

function getTodoById(state, id){
    let item = state.todos.filter((todo) => {
        return todo.id === id;
    })
    console.log('get by id', item);
    return item[0];
}

function getTodoIndexById(state, id){
    return state.todos.indexOf(getTodoById(state, id));
}

function getId(state){
    return state.todos.reduce((maxId, todo) => {
        return Math.max(todo.id, maxId)
    }, -1) + 1
}

const todoReducer = (state = {todos: [], filter: 'ALL'}, action) => {
    switch (action.type){
        case 'ADD_TODO':
            var todos = state.todos.concat(
                {
                    id: getId(state),
                    text: action.text,
                    completed: false
                }
            );
            var count = state.count + 1;
            return {todos, filter: state.filter}
        case 'CHANGE_VISIBILITY':
            return Object.assign({}, state, {filter: action.filter})
        case 'COMPLETED_TOGGLE':
            var index = getTodoIndexById(state, action.id);
            if(index === -1){throw new Error('Invalid index');}
            var new_todos = JSON.parse(JSON.stringify(state.todos));
            new_todos[index].completed = !new_todos[index].completed;
            return Object.assign({}, state, {todos: new_todos});
        case 'REMOVE_TODO':
            var index = getTodoIndexById(state, action.id);
            if(index === -1){throw new Error('Invalid index');}
            var new_todos = JSON.parse(JSON.stringify(state.todos));
            delete new_todos.splice(index, 1)[0];
            return Object.assign({}, state, {todos: new_todos});
        default:
            return state;
    }
}

const reducers = combineReducers({
    todo: todoReducer
})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_VISIBILITY'])
})

export default undoableReducer
