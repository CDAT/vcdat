import React from 'react'
/* global $ */
require('../../../../deps/quicktree.js')

var FileExplorer = React.createClass({
    propTypes: {
        addFileToCache: React.PropTypes.func
    },
    getInitialState() {
        return {
            files: {
                sub_items: {},
                file_selected: false
            }
        };
    },
    componentDidMount() {
        $('#file-explorer').on('shown.bs.modal', () => {
            $.get('getInitialFileTree').then((obj) => {
                obj = JSON.parse(obj);
                this.setState({files: obj});
            });
        });
    },
    loadFiles(event) {
        this.setFileSelected(false);
        var item = $(event.target);
        var path = item.attr('data-path') + item.text();
        $.get('browseFiles', {'path': path}).then((obj) => {
            let new_obj = JSON.parse(obj);
            let cur_state = this.state.files;
            let arr = new_obj.path.split('/');
            arr.splice(0, 1);
            arr.splice(-2, 2);
            let cur_tree = cur_state;
            arr.forEach((value) => {
                cur_tree = cur_tree.sub_items[value];
            })
            cur_tree.sub_items[new_obj.name] = new_obj;
            this.setState({files: cur_state});
        });
    },
    componentDidUpdate() {
        $('#file-tree').quicktree();
    },
    buildList(file_obj) {
        var list_items = Object.keys(file_obj.sub_items).map((value, index) => {
            if (Object.keys(file_obj.sub_items[value].sub_items).length) {
                return (
                    <li key={index}>
                        <a className='directory' data-path={file_obj.sub_items[value].path}>
                            <i className='glyphicon glyphicon-folder-close'></i>{value}
                        </a>
                        <ul>
                            {this.buildList(file_obj.sub_items[value])}
                        </ul>
                    </li>
                )
            } else {
                return (
                    <li key={index}>
                        {(() => {
                            if (file_obj.sub_items[value].directory) {
                                return (
                                    <a onClick={this.loadFiles} className='directory'
                                        data-path={file_obj.sub_items[value].path}
                                    >
                                        <i className='glyphicon glyphicon-folder-close'></i>{value}
                                    </a>
                                )
                            } else {
                                return (
                                    <a onClick={
                                            (file_obj.name != 'empty'
                                                ? this.setFileSelected.bind(this, true)
                                                : '')
                                        }
                                        className='file'
                                        data-path={file_obj.sub_items[value].path}
                                    >
                                        <i className='glyphicon glyphicon-file'></i>{value}
                                    </a>
                                );
                            }
                        })()}
                    </li>
                )
            }
        })
        return list_items;
    },
    setFileSelected(value){
        let state = this.state;
        state.file_selected = value;
        this.setState(state);
    },
    cacheFile(event) {
        let selected = $('#file-tree').find('.active');
        let path = selected.attr('data-path') + selected.text();
        this.filepath = path;
        this.filename = selected.text();
        $.get('loadVariablesFromFile', {'path': path}).then((obj) => {
            obj = JSON.parse(obj);
            this.props.addFileToCache(this.filename, this.filepath, obj.variables);
            $('#file-explorer').modal('hide');
        })
    },
    render() {
        return (
            <div className="modal fade" id='file-explorer' data-backdrop='static' data-keyboard='false'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">File Explorer</h4>
                        </div>
                        <div className="modal-body">
                            <ul id='file-tree' className='tree-view no-bullets'>
                                {this.buildList(this.state.files)}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.cacheFile}
                                disabled={!this.state.file_selected}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default FileExplorer;
