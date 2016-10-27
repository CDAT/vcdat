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
        updateActiveGM: React.PropTypes.func
    },
    getInitialState() {
        return {active_GM: {}};
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
        let gmProps = this.props.graphicsMethods[el.attr("data-parent")][el.attr("data-name")];
        let gmParent = el.attr("data-parent");
        let gm = el.attr("data-name");
        // call updateActiveGM
        this.updateActiveGM(gmProps, gmParent, gm)
        console.log(this.props.graphicsMethods[el.attr("data-parent")][el.attr("data-name")],el.attr("data-parent"),el.attr("data-name"))
    },
    updateActiveGM(props, parent, gm) {
        this.setState({
            active_GM: {
                gmProps: props,
                gmParent: parent,
                gm: gm
            }
        });
    },
    render() {
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
                <GraphicsMethodEditor
                    graphicsMethod={this.state.active_GM.gm}
                    graphicsMethodParent={this.state.active_GM.gmParent}
                    gmProps={this.state.active_GM.gmProps}
                    graphicsMethods={this.props.graphicsMethods}
                    updateGraphicsMethods={this.props.updateGraphicsMethods}
                    updateActiveGM={this.updateActiveGM}/>
            </div>
        )
    }
});

export default GMList;
