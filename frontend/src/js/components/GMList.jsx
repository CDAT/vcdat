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
                        {Object.keys(this.props.graphicsMethods).map((value, index) => {
                            return (
                                <li key={value} className='main-left-list-item'>
                                    <a>{value}</a>
                                    <ul className='no-bullets'>
                                        {this.props.graphicsMethods[value].map((value, index) => {
                                            return <li key={value} className='sub-left-list-item'>
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
