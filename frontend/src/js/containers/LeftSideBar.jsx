import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VarList from '../components/VarList.jsx'
import GMList from '../components/GMList.jsx'
import TemplateList from '../components/TemplateList.jsx'
import Actions from '../constants/Actions.js'
import {connect} from 'react-redux'


class LeftSideBar extends Component {
    
    render() {
        return (
            <div id='left-side-bar'>
                <VarList variables={this.props.variables}
                    loadVariables={this.props.loadVariables}
                    cachedFiles={this.props.cached_files}
                    removeVariable={this.props.removeVariable}
                    selectVariable={this.props.selectVariable}
                    selected_variable={this.props.selected_variable}
                />
                <GMList graphicsMethods={this.props.graphics_methods}
                    updateGraphicsMethod={this.props.updateGraphicsMethod}
                    colormaps={this.props.colormaps}
                    defaultMethods={this.props.default_methods}
                />
                <TemplateList
                    templates={this.props.templates}
                    selected_template={this.props.selected_template}
                    selectTemplate={this.props.selectTemplate}
                    updateTemplate={this.props.updateTemplate}
                />
            </div>
        )
    }
}
LeftSideBar.propTypes ={
    cached_files: PropTypes.object,
    getColormaps: PropTypes.func,
    graphics_methods: PropTypes.object,
    loadVariables: PropTypes.func,
    templates: PropTypes.arrayOf(PropTypes.string),
    selected_template: PropTypes.string,
    variables: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    colormaps: PropTypes.object,
    sheets_model: PropTypes.object,
    updateGraphicsMethods: PropTypes.func,
    selectTemplate: PropTypes.func,
    updateTemplate: PropTypes.func,
    removeVariable: PropTypes.func,
    selectVariable: PropTypes.func,
    selected_variable: PropTypes.string,
}

const mapStateToProps = (state) => {
    return {
        variables: state.present.variables,
        graphics_methods: state.present.graphics_methods,
        templates: state.present.templates.names,
        selected_template: state.present.templates.selected_template,
        cached_files: state.present.cached_files,
        sheets_model: state.present.sheets_model,
        colormaps: state.present.colormaps,
        default_methods: state.present.default_methods,
        selected_variable: state.present.selected_variable,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadVariables: (var_list) => dispatch(Actions.loadVariables(var_list)),
        removeVariable: (var_name) => {
            if(var_name){
                dispatch(Actions.removeVariable(var_name))
            }
            else{
                // error handling here. No variable selected when delete was pressed
            }
        },
        updateGraphicsMethod: (graphics_method) => {
            dispatch(Actions.updateGraphicsMethod(graphics_method))
        },
        selectTemplate: (name) => dispatch(Actions.selectTemplate(name)),
        updateTemplate: (template) => dispatch(Actions.updateTemplate(template)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);
