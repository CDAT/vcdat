import React from 'react'


var TemplateAxisSettings = React.createClass({
    propTypes: {
        label: React.PropTypes.object,
        update: React.PropTypes.func
    },
    updateLabelValue(key) {
        const self = this;
        let validator = parseFloat;
        if (key === "priority") {
            validator = parseInt;
        }
        return (e) => {
            self.props.update(key, validator(this.range(e.target.value)));
        };
    },
    range(alt){
        if(alt < 0){
            alt = 0;
        }
        else if (alt > 1){
            alt = 1;
        }
        return alt;
    },
    render() {
        const x = this.props.label.x;
        const y = this.props.label.y;
        const priority = this.props.label.priority;
        const name = this.props.label.member;

        return (
            <tr>
                <th>{name}</th>
                <td><input type="number" value={x} name="{name}_x" onChange={this.updateLabelValue("x")} /></td>
                <td><input type="number" value={y} name="{name}_y" onChange={this.updateLabelValue("y")} /></td>
                <td><input type="number" value={priority} name="{name}_priority" onChange={this.updateLabelValue("priority")} /></td>
            </tr>
        );
    },
})

export default TemplateAxisSettings;
