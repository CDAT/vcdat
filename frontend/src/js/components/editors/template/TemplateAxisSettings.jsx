import React from 'react'

var TemplateAxisSettings = React.createClass({
    propTypes: {
        axis: React.PropTypes.object,
        update: React.PropTypes.func
    },
    updateAxisValue(key) {
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
        if (alt < 0) {
            alt = 0;
        }
        else if (alt > 1) {
            alt = 1;
        }
        return alt;
    },
    render() {

        const name = this.props.axis.member;
        const priority = this.props.axis.priority;
        var isLabel = false;

        if (name.includes('label')) {
            isLabel = true;
        }

        if (name.includes('y')) {
            var axis = this.props.axis.x;
            var axis1 = this.props.axis.x1;
            var axis2 = this.props.axis.x2;
            var label = "x";
            var label1 = "x1";
            var label2 = "x2";
        }
        else if (name.includes('x')){
            var axis = this.props.axis.y;
            var axis1 = this.props.axis.y1;
            var axis2 = this.props.axis.y2;
            var label = "y";
            var label1 = "y1";
            var label2 = "y2";
        }

        return (
            <div>
                { isLabel ? (
                        <div>
                            {name}
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td>{label}</td>
                                    <td><input type="number" value={axis} name={name + "_" + label}
                                               onChange={this.updateAxisValue(label)}/></td>
                                </tr>
                                <tr>
                                    <td>Priority</td>
                                    <td><input type="number" value={priority} name={name + "_priority"}
                                               onChange={this.updateAxisValue("priority")}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            {name}
                            <table className="table">
                                <tbody>

                                <tr>
                                    <td>{label}1</td>
                                    <td><input type="number" value={axis1} name={name + "_" + label1}
                                               onChange={this.updateAxisValue(label1)}/></td>
                                </tr>
                                <tr>
                                    <td>{label}2</td>
                                    <td><input type="number" value={axis2} name={name + "_" + label2}
                                               onChange={this.updateAxisValue(label2)}/></td>
                                </tr>
                                <tr>
                                    <td>Priority</td>
                                    <td><input type="number" value={priority} name={name + "_priority"}
                                               onChange={this.updateAxisValue("priority")}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        );
    },
})

export default TemplateAxisSettings;
