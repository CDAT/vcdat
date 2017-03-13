import React from 'react';
/* global $ */

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
    componentWillMount() {
        $.get('browseFiles').then((obj) => {
            this.setState({files: obj});
        });
    },
    render() {
        return (
            <div></div>
        )
    }
})

export default FileExplorer;
