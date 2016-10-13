import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav.jsx';
import GraphicsMethodEditor from './modals/GraphicsMethodEditor.jsx';
require('../../../deps/quicktree.js');
/* global $ */

var el = null;
var GMList = React.createClass({
    propTypes: {
        graphicsMethods: React.PropTypes.object,
    },
    getInitialState() {
        return ({
            gmObj: {},
            graphicsMethodParent: 'boxfill',
            graphicsMethod: 'default'
        });
    },
    componentDidUpdate(){
        $('#gm-list').quicktree();
    },
    componentDidMount() {
        $('#gm-list').quicktree();
    },
    clickedEdit() {
        $('#graphics-method-editor').modal('show')
    },
    selectedChild(val) {
        if (el) {
            el.removeClass('bg-primary');
        }
        el = $(val.target);
        while (el.prop("tagName").toLowerCase() !== "li") {
            el = el.parent();
        }
        el.addClass('bg-primary')
        this.setState({
            gmObj: this.props.graphicsMethods[el.attr("data-parent")][el.attr("data-name")],
            graphicsMethodParent: el.attr("data-parent"),
            graphicsMethod: el.attr("data-name")
        });
        console.log(this.props.graphicsMethods[el.attr("data-parent")][el.attr("data-name")],el.attr("data-parent"),el.attr("data-name"))
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav editAction={this.clickedEdit} title='Graphics Methods'/>
                <div className='scroll-area'>
                    <ul id='gm-list' className='no-bullets left-list'>
                        {Object.keys(this.props.graphicsMethods).map((parent_value) => {
                            return (
                                <li key={parent_value} className='main-left-list-item'>
                                    <a>{parent_value}</a>
                                    <ul className='no-bullets'>
                                        {Object.keys(this.props.graphicsMethods[parent_value]).map((value) => {
                                            return (
                                                <li key={value}
                                                    onClick={this.selectedChild} 
                                                    className='sub-left-list-item draggable-list-item'
                                                    data-type='graphics_method' data-name={value}
                                                    data-parent={parent_value} style={{'display':'none'}}>
                                                        <a>{value}</a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <GraphicsMethodEditor
                    graphicsMethod={this.state.graphicsMethod}
                    grphicsMethodParent={this.state.graphicsMethodParent}
                    gmProps={this.state.gmObj}/>
            </div>
        )
    }
});

export default GMList;
