import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import DragAndDropTypes from "../../../constants/DragAndDropTypes.js";

const spec = {
    drop(props, monitor /* component */) {
        const variable = monitor.getItem();
        if (monitor.getItemType() === DragAndDropTypes.VAR) props.onDrop(variable);
    },
    hover(/* props, monitor, component */) {},
    canDrop(/* props, monitor */) {
        // console.log("Printing canDrop props and monitor")
        // console.log(props)
        // console.log(monitor)
        return true;
    }
};

const collect = function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        is_over: monitor.isOver(),
        can_drop: monitor.canDrop()
    };
};

class InputArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { connectDropTarget, can_drop, is_over } = this.props;
        let drop_class = "";
        if (is_over && can_drop) {
            drop_class = "drop-success";
        } else if (can_drop) {
            drop_class = "drop-hint";
        }

        return connectDropTarget(
            <div className={`input-area ${drop_class}`}>
                <div className="input-wrapper">
                    <input className="new-variable-name" type="text" placeholder={this.props.new_variable_placeholder} />
                    <span className="equals"> = </span>
                    <input className="calculation" type="text" value={this.props.calculation} disabled />
                </div>
            </div>
        );
    }
}

InputArea.propTypes = {
    new_variable_name: PropTypes.string,
    new_variable_placeholder: PropTypes.string,
    calculation: PropTypes.string,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    can_drop: PropTypes.bool, // prop added by react-dnd
    is_over: PropTypes.bool // prop added by react-dnd
};

export default DropTarget(DragAndDropTypes.VAR, spec, collect)(InputArea);
