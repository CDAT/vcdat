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
                    startTour={this.props.startTour}
                />
                <GMList 
                    updateGraphicsMethod={this.props.updateGraphicsMethod}
                    colormaps={this.props.colormaps}
                    defaultMethods={this.props.default_methods}
                    selected_graphics_type={this.props.selected_graphics_type}
                    selected_graphics_method={this.props.selected_graphics_method}
                    selectGraphicsMethod={this.props.selectGraphicsMethod}
                />
                <TemplateList
                    templates={this.props.templates}
                    selected_template={this.props.selected_template}
                    selectTemplate={this.props.selectTemplate}
                    updateTemplate={this.props.updateTemplate}
                    removeTemplate={this.props.removeTemplate}
                    startTour={this.props.startTour}
                />
            </div>
        )
    }
}
LeftSideBar.propTypes ={
    cached_files: PropTypes.object,
    getColormaps: PropTypes.func,
    
    loadVariables: PropTypes.func,
    templates: PropTypes.arrayOf(PropTypes.string),
    variables: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    colormaps: PropTypes.object,
    sheets_model: PropTypes.object,
    selectTemplate: PropTypes.func,
    selected_template: PropTypes.string,
    updateTemplate: PropTypes.func,
    removeTemplate: PropTypes.func,
    removeVariable: PropTypes.func,
    selectVariable: PropTypes.func,
    selected_variable: PropTypes.string,
    startTour: PropTypes.func,
    
}

const mapStateToProps = (state) => {
    return {
        variables: state.present.variables,
        templates: state.present.templates,
        selected_template: state.present.ui.selected_template,
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
        
        selectTemplate: (name) => dispatch(Actions.selectTemplate(name)),
        updateTemplate: (template) => dispatch(Actions.updateTemplate(template)),
        removeTemplate: (name) => dispatch(Actions.removeTemplate(name)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);
