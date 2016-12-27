import React from 'react'
/* global $ */


var TemplatePreview = React.createClass({
    propTypes: {
        template: React.PropTypes.object
    },
    componentDidUpdate(prevProps, prevState) {
        if (this.props.template) {
            let same = false;
            if (prevProps.template && prevProps.template.name === this.props.template.name) {
                const same_obj = (o1, o2) => {
                    if (o1 && o2) {
                        const k = Object.keys(o1);
                        return k.reduce((is_same, key) => {
                            if (is_same) {
                                return is_same;
                            }
                            if ($.isPlainObject(o1[key]) && $.isPlainObject(o2[key])) {
                                return same_obj(o1[key], o2[key]);
                            }
                            return o1[key] == o2[key];
                        }, false);
                    } else {
                        return o1 === o2;
                    }
                }
                same = same_obj(prevProps.template, this.props.template);
            }

            if (!same) {
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
            }
        }
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
