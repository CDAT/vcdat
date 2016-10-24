import React from 'react'

var Exts = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        ext1: React.PropTypes.bool,
        ext2: React.PropTypes.bool,
        className: React.PropTypes.string
    },
    getInitialState() {
        return {
            ext1: false,
            ext2: false
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            ext1: nextProps.ext1,
            ext2: nextProps.ext2
        })
    },
    handleChange(event) {
        this.setState({
            ext1: event.target.checked,
            ext2: event.target.checked
        });
        this.props.handleChange(event);
    },
    render(){
        return (
            <span>
                <div className={this.props.className}>
                    Ext 1:
                    <input type="checkbox"
                        name="ext_1"
                        onChange={this.props.handleChange}
                        checked={
                            this.state.ext1
                            ? true
                            : false }/>
                </div>
                <div className={this.props.className}>
                    Ext 2:
                    <input type="checkbox"
                        name="ext_2"
                        onChange={this.props.handleChange}
                        checked={
                            this.state.ext2
                            ? true
                            : false }/>
                </div>
            </span>
        );
    }
});

export default Exts;
