import React from 'react';
import AddEditRemoveNav from './AddEditRemoveNav.jsx';
import GraphicsMethodEditor from './modals/GraphicsMethodEditor.jsx';
require('../../../deps/quicktree.js');
/* global $ */

var el = null;
function siblingsVisible(element_name, parent_gm) {
    let first=$('#gm-list-'+parent_gm).children().children()[0]
    return $(first).css("display")==='list-item' ?true :false;
}
var GMList = React.createClass({
    propTypes: {
        graphicsMethods: React.PropTypes.object,
        updateActiveGM: React.PropTypes.func,
        colormaps: React.PropTypes.object,
    },
    componentWillUpdate() {
        $('#gm-list').quicktree();
    },
    componentDidUpdate(){
        $('#gm-list').quicktree();
    },
    componentDidMount() {
        $('#gm-list').quicktree();
    },
    clickedEdit() {
        if (this.state.activeGM) {
            $('#graphics-method-editor').modal('show')
        }
    },
    getInitialState() {
        return {
            activeGM: false,
            activeGMParent: false
        }
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
        let gm = el.attr("data-name");
        let gm_parent = el.attr('data-parent');
        this.setState({
            activeGM: gm,
            activeGMParent: gm_parent,
        });
    },
    render() {
        let gmEditor = "";
        if (this.state && this.state.activeGM) {
            gmEditor = <GraphicsMethodEditor colormaps={this.props.colormaps}
                    graphicsMethod={this.props.graphicsMethods[this.state.activeGMParent][this.state.activeGM]}
                    updateGraphicsMethod={this.props.updateGraphicsMethod} />
        }
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav editAction={this.clickedEdit} title='Graphics Methods'/>
                <div className='scroll-area'>
                    <ul id='gm-list' className='no-bullets left-list'>
                        {Object.keys(this.props.graphicsMethods).map((parent_value) => {
                            return (
                                <li key={parent_value} className='main-left-list-item'
                                    id={'gm-list-'+parent_value}>
                                    <a>{parent_value}</a>
                                    <ul className='no-bullets'>
                                        {Object.keys(this.props.graphicsMethods[parent_value]).map((value) => {
                                            return (
                                                <li key={value}
                                                    onClick={this.selectedChild}
                                                    className='sub-left-list-item draggable-list-item'
                                                    data-type='graphics_method' data-name={value}
                                                    data-parent={parent_value}
                                                    style={
                                                        siblingsVisible(value, parent_value)
                                                        ? {'display': 'list-item'}
                                                        : {'display':'none'}
                                                    }>
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
                {gmEditor}
            </div>
        )
    }
});

export default GMList;
