import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'

var GMList = React.createClass({
    componentDidMount() {
        $('#gm-list').quicktree();
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Graphics Methods'/>
                <div className='scroll-area'>
                    <ul id='gm-list' className='no-bullets left-list'>
                        {Object.keys(this.props.graphicsMethods).map((parent_value, index) => {
                            return (
                                <li key={parent_value} className='main-left-list-item'>
                                    <a>{parent_value}</a>
                                    <ul className='no-bullets'>
                                        {this.props.graphicsMethods[parent_value].map((value, index) => {
                                            return <li key={value} className='sub-left-list-item draggable-list-item' data-type='graphics_method' data-name={value} data-parent={parent_value}>
                                                <a>{value}</a>
                                            </li>
                                        })}
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
});

export default GMList;
