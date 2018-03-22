import React, { Component } from 'react'
import { DropTarget } from 'react-dnd';
import DragAndDropTypes from '../constants/DragAndDropTypes.js';

class AddPlotZone extends Component {
    constructor(props){
        super(props)
        this.state = {
            highlight: false,
        }
        this.handleClick = this.handleClick.bind(this)
    }
    
    handleClick(){
        this.props.addPlot(null, null, null, null, this.props.row, this.props.col)
    }

    render(){
        return(
            this.props.connectDropTarget(
                <div className='plotter-add-plot'>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" onClick={this.handleClick}>
                        <circle 
                            cx="256"
                            cy="256"
                            r="224"
                            fill="none"
                            stroke={this.props.is_over && this.state.highlight ? "lime" : "black"}
                            strokeWidth="64"
                        />
                        <path 
                            fill={this.props.is_over && this.state.highlight ? "lime" : "black"}
                            d="M256,256 m-160,-32 l128,0 l0,-128 l64,0 l0,128 l128,0 l0,64 l-128,0 l0,128 l-64,0 l0,-128 l-128,0 z"
                        />
                    </svg>
                </div>
            )
        )
    }
}

AddPlotZone.propTypes = {
    connectDropTarget: React.PropTypes.func,
    is_over: React.PropTypes.bool,
    addPlot: React.PropTypes.func,
    row: React.PropTypes.number,
    col: React.PropTypes.number,
}

const addPlotTarget = {
    drop(props, monitor, component) {
        props.onDrop()
        const item = monitor.getItem();
        let var_name = null;
        let graphics_method_parent = null;
        let graphics_method = null;
        let template = null;
        let row = props.row;
        let col = props.col;

        switch (monitor.getItemType()) {
            case DragAndDropTypes.GM:
                graphics_method_parent = item.gmType;
                graphics_method = item.gmName;
                break;
            case DragAndDropTypes.VAR:
                var_name = item.variable;
                break;
            case DragAndDropTypes.TMPL:
                template = item.template;
                break;
        }
        component.setState({highlight: false}) 
        props.addPlot(var_name, graphics_method_parent, graphics_method, template, row, col);
    },
    hover(props, monitor, component){
        component.setState({highlight: true})
    }
};

/* istanbul ignore next */
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        is_over: monitor.isOver(),
    };
}

export { addPlotTarget } // for testing purposes
export default DropTarget(DragAndDropTypes.PLOT_COMPONENTS, addPlotTarget, collect)(AddPlotZone);