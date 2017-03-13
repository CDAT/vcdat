import React from 'react'
import AddEditRemoveNav from './AddEditRemoveNav.jsx'
import VariableEditor from './modals/VariableEditor.jsx';
/* global $ */

var VarList = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func,
        cachedFiles: React.PropTypes.object,
        loadVariables: React.PropTypes.func,
        variables: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])

    },
    openDialog(){
        this.setState({showEditor: true});
    },
    getInitialState() {
        return {
            showEditor: false
        };
    },
    render() {

        return (
            <div className='left-side-list scroll-area-list-parent'>
                <AddEditRemoveNav title='Variables' addAction={this.openDialog} />
                <div className='scroll-area'>
                    <ul id='var-list' className='no-bullets left-list'>
                        {Object.keys(this.props.variables).map((value, index) => {
                            let class_name = 'main-left-list-item draggable-list-item';
                            return (
                                <li key={value} className={class_name} data-type='variable' data-name={value}>
                                    <a>{value}</a>
                                </li>
                            );
                        })};
                    </ul>
                </div>
                <VariableEditor variables={this.props.variables} showing={this.state.showEditor} />
            </div>
        )
        /*
            <CachedFiles curVariables={this.props.variables}
                     loadVariables={this.props.loadVariables}
                     cachedFiles={this.props.cachedFiles} />
            <FileExplorer addFileToCache={this.props.addFileToCache}/>
        */
    }
});

export default VarList;
