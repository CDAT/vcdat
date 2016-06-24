import React from 'react';

var TodoList = React.createClass({
    render() {
        console.log('listprops', this.props);
        return (
            <div className='row text-center'>
                <ul className='no-bullets'>
                    {this.props.todos.map((todo, index) => {
                        return (
                            <li key={todo.id}>
                                <button className='black-text' onClick={this.props.removeTodo.bind(this, todo.id)}>X</button>
                                {todo.text}
                                <input type='checkbox' onChange={this.props.completedToggle.bind(this, todo.id)} checked={todo.completed} />
                                Completed
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
})

module.exports = TodoList;
