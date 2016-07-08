import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'

var TemplateList = React.createClass({
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Templates'/>
                <div className='scroll-area'>
                <ul id='temp-list' className='no-bullets left-list'>
                    {this.props.templates.map((value, index) => {
                        return (<li key={value} className='main-left-list-item'><a>{value}</a></li>)
                    })}
                </ul>
            </div>
            </div>
        )
    }
});

export default TemplateList;
