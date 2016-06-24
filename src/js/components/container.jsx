import React from 'react'
import TodoList from './list.jsx'
import Search from './input.jsx'
import UndoRedo from './undo_redo.jsx'
import Filters from './filters.jsx'
import Actions from '../redux/actions.js'
import { connect } from 'react-redux'

const filterTodos = (state) => {
    console.log('filtering', state)
    switch(state.present.todo.filter){
        case 'ALL':
            console.log('returing all', state.present.todo.todos);
            return state.present.todo.todos;
        case 'COMPLETED':
            return state.present.todo.todos.filter((todo) => {return todo.completed});
        case 'UNCOMPLETED':
            return state.present.todo.todos.filter((todo) => {return !todo.completed});
    }
}

var Container = React.createClass({
    getInitialState() {
        return {}
    },
    render() {
        console.log('container props', this.props);
        return (
            <div>
                <UndoRedo />
                <Search addTodo={this.props.addTodo} id='search' />
                <TodoList todos={this.props.todos} completedToggle={this.props.completedToggle} removeTodo={this.props.removeTodo}/>
                <p>Total Count: {this.props.todos.length}</p>
                <Filters filterAll={this.props.filterAll} filterCompleted={this.props.filterCompleted} filterUncompleted={this.props.filterUncompleted}/>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    //if you connect and only want the component to know about a piece of the model
    //do that here
    console.log('filtered', filterTodos(state));

    return {
        todos: filterTodos(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTodo: (text) => dispatch(Actions.addTodo(text)),
        filterAll: () => dispatch(Actions.changeVisibility('ALL')),
        filterCompleted: () => dispatch(Actions.changeVisibility('COMPLETED')),
        filterUncompleted: () => dispatch(Actions.changeVisibility('UNCOMPLETED')),
        completedToggle: (id) => dispatch(Actions.completedToggle(id)),
        removeTodo: (id) => dispatch(Actions.removeTodo(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
