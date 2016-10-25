import React from 'react'

var BoxfillType = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        type: React.PropTypes.string,
        headerClass: React.PropTypes.string,
        radioClass: React.PropTypes.string
    },
    getInitialState() {
        return {
            type: '',
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type
        })
    },
    handleChange(event) {
        this.setState({type:event.target.value});
        this.props.handleChange(event);
    },
    render(){
        return (
            <div className='row'>
                <div className={this.props.headerClass}>
                    <h5>
                        Boxfill type:
                    </h5>
                </div>
                <div className={this.props.radioClass}>
                    <input type='radio'
                        name='boxfill_type'
                        value='linear'
                        id="bf-linear"
                        onChange={this.handleChange}
                        checked={
                            this.state.type === 'linear'
                            ? true
                            :false
                        }/> linear
                </div>
                <div className={this.props.radioClass}>
                    <input type='radio'
                        name='boxfill_type'
                        value='custom'
                        id="bf-custom"
                        onChange={this.handleChange}
                        checked={
                            this.state.type === 'custom'
                            ? true
                            : false}/> custom
                </div>
            </div>
        );
    }
});

export default BoxfillType;
