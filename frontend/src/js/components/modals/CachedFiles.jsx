import React from 'react';

import FileExplorer from './FileExplorer.jsx';
import Tree from '../Tree.jsx';


var CachedFiles = React.createClass({
    propTypes: {
        cachedFiles: React.PropTypes.object,
        loadVariables: React.PropTypes.func
    },
    getProvenance(path, var_name){
        return $.get('getVariableProvenance', {'path': path, 'varname': var_name})
    },
    loadVariable(){
        let var_long_name = this.state.activeVar;
        let var_name = var_long_name.split(' (')[0]
        let filename = this.state.activeFile;
        let path = this.props.cachedFiles[filename].filepath;

        let var_obj = {};
        let var_provenance = {};
        this.getProvenance(path, var_name)
            .then((result) => {
                let obj = result;
                var_provenance = obj;
                var_obj[var_name] = {
                    cdms_var_name: var_name,
                    filename: filename,
                    path: path,
                    provenance: var_provenance
                };
                this.props.loadVariables([var_obj])
                $('#cached-files').modal('hide');
            })
            .fail((error) => 'fail');
    },
    list_variables(variable_array){
        const variables = variable_array.map((vars) =>
            <option>{vars}</option>);
        return (
            <select>{variables}</select>
        );
    },
    render() {

        var var_array = [];
        for(var key in this.props.cachedFiles){
            var path = this.props.cachedFiles[key]['filepath'];
            for (var subkey in this.props.cachedFiles[key]['variables']) {
                var_array.push(this.props.cachedFiles[key]['variables'][subkey]);
            }
        }

        return (
            <div className="modal fade" id='cached-files' data-backdrop='static' data-keyboard='false'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Load Variable</h4>
                        </div>
                        <div className="modal-body">
                            <div>
                                <h5> Load From </h5>
                                <table className="table">x
                                    <tbody>
                                    <tr>
                                        <td width="75px"> File </td>
                                        <td>
                                            <input type="text" name="file_path" value={path}/>
                                            <button className="btn-secondary btn-link"
                                                    onClick={() => {$('#file-explorer').modal('show')}}
                                            >
                                                <i className='glyphicon glyphicon-plus-sign'></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> Variables(s): </td>
                                        <td>
                                             { this.list_variables(var_array) }
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td width="75px"> History: </td>
                                        <td><input type="text" name="history"/></td>
                                    </tr>
                                    <tr>
                                        <td> Bookmarks: </td>
                                        <td><input type="text" name="bookmarks"/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h5>Dimensions</h5>

                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-sm" onClick={(e) => {
                                this.loadVariable()
                            }}>Load
                            </button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={(e) => {
                                this.loadVariable()
                            }}>Load and Close
                            </button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={(e) => {
                                this.loadVariable()
                            }}>Load As
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default CachedFiles;
