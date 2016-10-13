import React from 'react'

var BoxfillType = React.createClass({
    propTypes: {
        defaultType: React.PropTypes.string
    },
    getInitialState() {
        return {type: this.props.defaultType}
    },
    onClick(event){
        this.setState({type: event.target.value})
    },
    render() {
        return (
            <div>
                <td>Boxfill type:</td>
                <td>
                    <input type='radio' name='boxfill-type' value='linear' onClick={this.onClick}/> linear
                    <input type='radio' name='boxfill-type' value='log10' onClick={this.onClick}/> log10
                    <input type='radio' name='boxfill-type' value='custom' onClick={this.onClick}/> custom
                </td>
            </div>
        )
    }
});

export default BoxfillType;
