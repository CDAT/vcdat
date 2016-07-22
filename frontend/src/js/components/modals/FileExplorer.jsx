import React from 'react'

var FileExplorer = React.createClass({
    getInitialState() {
        return {
            files: {
                sub_items: {}
            }
        };
    },
    componentDidMount() {
        $('#file-explorer').on('shown.bs.modal', () => {
            $.get('browseFiles').then((obj) => {
                obj = JSON.parse(obj);
                console.log('got files', obj);
                var files_obj = {
                    directory: true,
                    sub_items: {},
                    name: 'sampson9',
                    path: obj.dir_path
                };
                this.start_path = obj.dir_path;
                obj.files.forEach((value) => {
                    console.log('value', value)
                    files_obj.sub_items[value.name] = value;
                })
                console.log('files_obj', files_obj)
                this.setState({files: files_obj})
            })
        })
    },
    loadFiles(event) {
        // console.log(event.target);
        var item = $(event.target);
        var path = item.attr('data-path') + '/' + item.text();
        // console.log('path', path)
        $.get('browseFiles', {'path': path}).then((obj) => {
            let new_obj = JSON.parse(obj);
            // console.log('new_obj', new_obj, new_obj.dir_path, new_obj.files);
            let cur_state = this.state.files;
            let arr = new_obj.dir_path.replace(this.start_path, '').split('/');
            arr.splice(0, 1);
            let cur_tree = cur_state;
            // console.log('arr', arr)
            arr.forEach((value) => {
                console.log('cur_tree', cur_tree, value)
                cur_tree = cur_tree.sub_items[value];
            })
            // cur_tree._path = new_obj.dir_path;
            new_obj.files.forEach((value) => {
                console.log('value', cur_tree, value)
                cur_tree.sub_items[value.name] = value;
            })
            this.setState({files: cur_state});
        });
    },
    componentDidUpdate() {
        $('#file-tree').quicktree();
    },
    buildList(file_obj) {
        // console.log('file_obj', file_obj)
        // console.log('sub_items', file_obj.sub_items);
        var list_items = Object.keys(file_obj.sub_items).map((value, index) => {
            // console.log('value', value, Object.keys(file_obj.sub_items[value].sub_items));
            if (Object.keys(file_obj.sub_items[value].sub_items).length) {
                return (
                    <li key={index}>
                        <a className='directory' data-path={file_obj.sub_items[value].path}><i className='glyphicon glyphicon-folder-close'></i>{value}</a>
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
                                    <a onClick={this.loadFiles} className='directory' data-path={file_obj.sub_items[value].path}><i className='glyphicon glyphicon-folder-close'></i>{value}</a>
                                )
                            } else {
                                return (
                                    <a onClick={this.sendPath} className='file' data-path={file_obj.sub_items[value].path}><i className='glyphicon glyphicon-file'></i>{value}</a>
                                )
                            }
                        })()}
                    </li>
                )
            }
        })
        return list_items;
    },
    sendPath(event) {
        let path = $(event.target).attr('data-path') + '/' + $(event.target).text();
        $.get('loadVariablesFromFile', {'path': path}).then((obj) => {
            obj = JSON.parse(obj);
            this.props.loadVariables(obj.variables)
        })
    },
    render() {
        return (
            <div className="modal fade" id='file-explorer'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">File Explorer</h4>
                        </div>
                        <div className="modal-body">
                            <ul id='file-tree' className='no-bullets'>
                                {this.buildList(this.state.files)}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Open</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default FileExplorer;
