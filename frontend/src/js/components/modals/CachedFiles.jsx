import React from 'react';
import Tree from '../Tree.jsx';
import FileExplorer from './FileExplorer.jsx';


var CachedFiles = React.createClass({
    propTypes: {
        cachedFiles: React.PropTypes.object,
        loadVariables: React.PropTypes.func,
        addFileToCache: React.PropTypes.func,
    },
    getInitialState(){
        return {
            showFileExplorer: false
        }
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
    handleFileExplorerTryClose(){
        this.setState({ showFileExplorer:false });
    },
    render() {
        const cachedTree = Object.keys(this.props.cachedFiles).map((filename) => {
            const f = this.props.cachedFiles[filename];
            return {
                title: filename,
                contents: f.variables
            };
        });
        return (
            <div className="modal fade" id='cached-files' data-backdrop='static' data-keyboard='false'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">Recent Files</h4>
                            <button onClick={
                                    () => this.setState({showFileExplorer: true})
                                }
                                className='btn btn-default'
                            >
                                Add
                            </button>
                        </div>
                        <div className="modal-body">
                            <Tree contents={cachedTree} activate={(p) => { this.setState({activeFile: p[0], activeVar: p[1]}); }}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={(e) => {this.loadVariable()}}>Open</button>
                        </div>
                    </div>
                </div>
                <FileExplorer show={this.state.showFileExplorer} onTryClose={this.handleFileExplorerTryClose} addFileToCache={this.props.addFileToCache}/>
            </div>
        )
    }
})

export default CachedFiles;
