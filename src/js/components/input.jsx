import React from 'react'

var Search = React.createClass({
    handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault;
            var value = this.refs.todo_input.value;
            this.props.addTodo(value);
            this.refs.todo_input.value = '';
        }
    },
    render() {
        return (
            <div className='row text-center' id='search'>
                <input onKeyUp={this.handleKeyPress} ref='todo_input'></input>
            </div>
        );
    }
})

module.exports = Search;
