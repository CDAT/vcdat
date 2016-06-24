import React from 'react'

var Filters = React.createClass({
    render() {
        return (
            <div className='row text-center black-text'>
                <p>Filters:</p>
                <button onClick={this.props.filterAll}>All</button>
                <button onClick={this.props.filterCompleted}>Completed</button>
                <button onClick={this.props.filterUncompleted}>Uncompleted</button>
            </div>
        )
    }
})

export default Filters
