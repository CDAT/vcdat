import React from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import {connect} from 'react-redux';
import $ from 'jquery';

var Canvas = React.createClass({
    propTypes: {
        plots: React.PropTypes.array,
    },
    componentDidMount() {
        this.canvas = vcs.init(this.refs.div);
    },
    componentDidUpdate(prevProps, prevState) {
        //this.canvas.clear()
        this.props.plots.map((plot) => {
            if (plot.variables.length > 0) {
                this.canvas.plot(plot.variables.map((v) => { return v.provenance; }), {"g_name": "Gfb"});
            }
        });
    },
    render() {
        return (
            <div className="cell-stack-top" ref="div"></div>
        )
    }
});

export default Canvas;