import React from 'react'
import VarList from '../components/VarList.jsx'
import GMList from '../components/GMList.jsx'
import TemplateList from '../components/TemplateList.jsx'
import {connect} from 'react-redux'

var LeftSideBar = React.createClass({
    initDragListItems(){
        $('.draggable-list-item').draggable({
            opacity: 0.7,
            helper: 'clone',
            zIndex:2,
            cursorAt: {
                left:0,
                bot: 0
            },
            cursor: 'pointer',
            stop(){
                $('.cell-stack-bottom').removeClass('plotter-to-top');
            }

        })
    },
    componentDidMount() {
        $('#left-side-bar').resizable({ghost: true, handles: 'e', minWidth: 100, maxWidth: 500})
        this.initDragListItems();
    },
    componentDidUpdate(){
        this.initDragListItems();
    },
    render() {
        return (
            <div id='left-side-bar' className=''>
                <VarList variables={this.props.variables}/>
                <GMList graphicsMethods={this.props.graphics_methods}/>
                <TemplateList templates={this.props.templates}/>
            </div>
        )
    }
})

const mapStateToProps = (state) => {
    return {variables: state.present.variables, graphics_methods: state.present.graphics_methods, templates: state.present.templates}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);
