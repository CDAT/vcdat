import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'

var TemplateList = React.createClass({
    getInitialState(){
        return {};
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Templates'/>
                <div className='scroll-area'>
                    <ul id='temp-list' className='no-bullets left-list'>
                        {this.props.templates.map((value, index) => {
                            let class_name = 'main-left-list-item draggable-list-item';
                            return (
                                <li key={value} className={class_name} data-type='template' data-name={value}>
                                    <a>{value}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
});

export default TemplateList;
