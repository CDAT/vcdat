import React from 'react'

var Exts = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        ext1: React.PropTypes.bool,
        ext2: React.PropTypes.bool,
        className: React.PropTypes.string
    },
    render(){
        return (
            <span>
                <div className={this.props.className}>
                    Ext 1:
                    {
                        this.props.ext1
                            ? <input type="checkbox"
                                name="ext_1"
                                onChange={this.props.handleChange}
                                defaultChecked/>
                            : <input type="checkbox"
                                name="ext_1"
                                onChange={this.props.handleChange}/>
                    }
                </div>
                <div className={this.props.className}>
                    Ext 2:
                    {
                        this.props.ext2
                            ? <input type="checkbox"
                                name="ext_2"
                                onChange={this.props.handleChange}
                                defaultChecked/>
                            : <input type="checkbox"
                                name="ext_2"
                                onChange={this.props.handleChange}/>
                    }
                </div>
            </span>
        );
    }
});

export default Exts;
