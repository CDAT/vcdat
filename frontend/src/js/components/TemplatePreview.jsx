import React from 'react'
/* global $ */


var TemplatePreview = React.createClass({
    propTypes: {
        template: React.PropTypes.object
    },
    componentDidUpdate(prevProps, prevState) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                var img = document.getElementById('tmpl-img');
                img.src = URL.createObjectURL(this.response);
            }
        }
        xhr.open('POST', '/plotTemplate');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = 'blob';
        xhr.send(JSON.stringify(this.props.template));
    },
    render() {
        return (
            <div id='tmpl-preview'>
                <img id='tmpl-img' />
            </div>
        )
    }
})

export default TemplatePreview;
