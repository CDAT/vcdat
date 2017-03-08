import React from 'react'

var TemplateAxisSettings = React.createClass({
    propTypes: {
        axis: React.PropTypes.object,
        update: React.PropTypes.func
    },
    updateAxisValueX(key) {
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
        const x = this.props.axis.x;
        const x1 = this.props.axis.x1;
        const x2 = this.props.axis.x2;

        var isLable = false;
        if (name.includes('label')) {
            isLable = true;
        }

        return (
            <div>
                { isLable ? (
                        <table className="table">
                            <tbody>
                            <tr>
                                <th>
                                    {name}
                                </th>
                            </tr>
                            <tr>
                                <td>Y</td>
                                <td><input type="number" value={x} name="{name}_x"
                                           onChange={this.updateAxisValueX("x")}/></td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td><input type="number" value={priority} name="{name}_priority"
                                           onChange={this.updateAxisValueX("priority")}/></td>
                            </tr>
                            </tbody>
                        </table>
                    ) : (
                        <table className="table">
                            <tbody>
                            <tr>
                                <th>
                                    {name}
                                </th>
                            </tr>
                            <tr>
                                <td>Y1</td>
                                <td><input type="number" value={x1} name="{name}_x1"
                                           onChange={this.updateAxisValueX("x1")}/></td>
                            </tr>
                            <tr>
                                <td>Y2</td>
                                <td><input type="number" value={x2} name="{name}_x2"
                                           onChange={this.updateAxisValueX("x2")}/></td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td><input type="number" value={priority} name="{name}_priority"
                                           onChange={this.updateAxisValueX("priority")}/></td>
                            </tr>
                            </tbody>
                        </table>
                    )}
            </div>
        );
    },
})

export default TemplateAxisSettings;
