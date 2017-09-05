import React from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import { connect } from 'react-redux';
import $ from 'jquery';
import _ from 'lodash';

var Canvas = React.createClass({
    propTypes: {
        plots: React.PropTypes.array,
        plotVariables: React.PropTypes.array,
        onTop: React.PropTypes.bool,
    },
    componentDidMount() {
        this.canvas = vcs.init(this.refs.div);
    },
    componentDidUpdate(prevProps, prevState) {
        // Sync the size of the canvas
        var div = $(this.refs.div);
        var canvas = $(this.refs.div).find("canvas");
        canvas.attr("width", div.width());
        canvas.attr("height", div.height());
        this.canvas.clear()
        if (this.props.plots !== prevProps.plots) {
            this.props.plots.map((plot, index) => {
                if (plot.variables.length > 0) {
                    var variables = this.props.plotVariables[index];
                    var dataSpecs = variables.map(function (variable) {
                        var dataSpec = {
                            uri: variable.path,
                            variable: variable.cdms_var_name
                        };
                        var subRegion = {};
                        variable.dimension
                            .filter(dimension => dimension.values)
                            .forEach((dimension) => {
                                subRegion[dimension.axisName] = dimension.values.range;
                            })
                        if (!_.isEmpty(subRegion)) {
                            dataSpec['operations'] = [{ subRegion }];
                        }

                        var axis_order = variable.dimension.map((dimension) => variable.axisList.indexOf(dimension.axisName));
                        if (axis_order.some((order, index) => order !== index)) {
                            dataSpec['axis_order'] = axis_order;
                        }
                        return dataSpec;
                    });
                    console.log('plotting', dataSpecs, this.props.plotGMs[index], plot.template);
                    this.canvas.plot(dataSpecs, this.props.plotGMs[index], plot.template);
                }
            });
        }
    },
    componentWillUnmount() {
        this.canvas.close();
    },
    render() {
        return (
            <div className={this.props.onTop ? "cell-stack-top" : "cell-stack-bottom"} ref="div"></div>
        )
    }
});

const mapStateToProps = (state, ownProps) => {
    var can_plot = ownProps.plots.reduce((prevVal, curVal) => {
        if (prevVal === false) {
            return prevVal;
        }
        return curVal.variables.length > 0;
    }, true);

    if (!can_plot) {
        return {
            plotVariables: [],
        }
    }
    // When GMs are loaded, use this function to extract them from the state
    var get_gm_for_plot = (plot) => {
        return state.present.graphics_methods[plot.graphics_method_parent][plot.graphics_method];
    };

    var get_vars_for_plot = (plot) => {
        return plot.variables.map((variable) => {
            return state.present.variables[variable];
        });
    };

    return {
        plotVariables: ownProps.plots.map(get_vars_for_plot),
        plotGMs: ownProps.plots.map(get_gm_for_plot),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
