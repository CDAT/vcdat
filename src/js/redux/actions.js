var Actions = {
    addTodo(text){
        return {
            type: 'ADD_TODO',
            text: text
        }
    },
    changeVisibility(filter){
        let valid_filters = ['ALL', 'COMPLETED', 'UNCOMPLETED']
        if (valid_filters.indexOf(filter) === -1){
            throw 'Cannot change filter to ' + filter;
        }

        return {
            type: 'CHANGE_VISIBILITY',
            filter: filter
        }
    },
    completedToggle(id){
        return {
            type: 'COMPLETED_TOGGLE',
            id: id
        }
    },
    removeTodo(id){
        return{
            type: 'REMOVE_TODO',
            id: id
        }
    }

}

export default Actions;
