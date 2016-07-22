import React from 'react'
import FileExplorer from './FileExplorer.jsx'

var CachedFiles = React.createClass({
    componentDidUpdate(){
        $('#cache-tree').quicktree();
    },
    componentDidMount(){
        $('#cache-tree').quicktree();
    },
    loadVariable(event){
        let selected = $('#cache-tree').find('.active');
        let var_name = selected.text();
        this.props.loadVariables([selected.text()])
        $('#cached-files').modal('hide');
    },
    render() {
        console.log('rendering cached files')
        return (
            <div className="modal fade" id='cached-files' data-backdrop='static' data-keyboard='false'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">Recent Files</h4>
                            <button onClick={() => {$('#file-explorer').modal('show')}} className='btn btn-default'>Add</button>
                        </div>
                        <div className="modal-body">
                            <ul id='cache-tree' className='tree-view no-bullets'>
                                {Object.keys(this.props.cachedFiles).map((value, index) => {
                                    return (
                                        <li key={index}>
                                            <a>{value}</a>
                                            <ul>
                                                {this.props.cachedFiles[value].variables.map((value, index)=>{
                                                    return (<li key={index} style={{'display': 'none'}}>
                                                        <a>{value}</a>
                                                    </li>)
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.loadVariable}>Open</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default CachedFiles;
