import React from 'react'
import VarList from '../components/VarList.jsx'
import GMList from '../components/GMList.jsx'
import TemplateList from '../components/TemplateList.jsx'
import {connect} from 'react-redux'

var LeftSideBar = React.createClass({
    componentDidMount() {
        $('#left-side-bar').resizable({ghost: true, handles: 'e', minWidth: 100, maxWidth: 500})
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
