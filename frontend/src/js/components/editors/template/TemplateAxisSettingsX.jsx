import React from 'react'

var TemplateAxisSettings = React.createClass({
    propTypes: {
        axis: React.PropTypes.object,
        update: React.PropTypes.func
    },
    updateAxisValueY(key) {
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
        const y = this.props.axis.y;
        const y1 = this.props.axis.y1;
        const y2 = this.props.axis.y2;

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
                                <td><input type="number" value={y} name="{name}_y"
                                           onChange={this.updateAxisValueY("y")}/></td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td><input type="number" value={priority} name="{name}_priority"
                                           onChange={this.updateAxisValueY("priority")}/></td>
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
                                <td><input type="number" value={y1} name="{name}_y1"
                                           onChange={this.updateAxisValueY("y1")}/></td>
                            </tr>
                            <tr>
                                <td>Y2</td>
                                <td><input type="number" value={y2} name="{name}_y2"
                                           onChange={this.updateAxisValueY("y2")}/></td>
                            </tr>
                            <tr>
                                <td>Priority</td>
                                <td><input type="number" value={priority} name="{name}_priority"
                                           onChange={this.updateAxisValueY("priority")}/></td>
                            </tr>
                            </tbody>
                        </table>
                    )
                }
            </div>
        );
    },
})

export default TemplateAxisSettings;
