import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'

var VarList = React.createClass({
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Variables' />
                <div className='scroll-area'>
                    <ul id='var-list' className='no-bullets left-list'>
                        {this.props.variables.map((value, index) => {
                            return (
                                <li key={value} className='main-left-list-item'>
                                    <a>{value}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
});

export default VarList;
