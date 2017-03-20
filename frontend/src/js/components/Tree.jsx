import React, { Component } from 'react';
import {DragSource} from 'react-dnd';


class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disclosed: false
        };
    }
    clicked() {
        if (!this.state.disclosed || !this.props.contents.length) {
            this.props.activate([this.props.title]);
        }
        if (this.props.contents) {
            this.setState({"disclosed": !this.state.disclosed});
        }
    }
    activateChild(path) {
        path.unshift(this.props.title);
        this.props.activate(path);
    }
    render() {
        var disclosed = this.state.disclosed;
        var active = this.props.active;
        var is_node = this.props.contents && this.props.contents.length;
        var classnames = [is_node ? "tree-node":"tree-leaf"];
        if (disclosed) {
            classnames.push("disclosed");
        }
        if (active === true && !is_node) {
            classnames.push("active");
        }

        // simple node transform
        let f = (n) => { return n; };
        if (this.props.connectDragSource) {
            f = this.props.connectDragSource;
        }

        return f(
            <li className={classnames.join(" ")}>
                <a onClick={(e) => this.clicked()}>{this.props.title}</a>
                {is_node ? <Tree dragNode={this.props.dragNode} disclosed={disclosed} activate={(p) => this.activateChild(p)} contents={this.props.contents} /> : "" }
            </li>
        );
    }
}

export default class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
        if (props.dragType && props.dragSource && props.dragCollect) {
            this.state.dragNode = DragSource(props.dragType, props.dragSource, props.dragCollect)(TreeNode);
        } else {
            if (props.dragNode) {
                this.state.dragNode = props.dragNode;
            } else {
                this.state.dragNode = TreeNode;
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        var new_state = {};
        if (nextProps.disclosed === false) {
            new_state["active"] = false;
        }
        // It's a leaf node
        // Now check if we should enable drag and drop
        if (nextProps.dragType && nextProps.dragSource && nextProps.dragCollect) {
            this.state.dragNode = DragSource(nextProps.dragType, nextProps.dragSource, nextProps.dragCollect)(TreeNode);
        } else if (nextProps.dragNode) {
            this.state.dragNode = nextProps.dragNode;
        } else {
            this.state.dragNode = TreeNode;
        }
    }
    render() {
        const style = {};
        if (this.props.disclosed) {
            style["display"] = "block";
        } else {
            style["display"] = "none";
        }

        return (
            <ul className="tree" style={style}>
                {this.props.contents.map((child, ind) => {
                    if (typeof child !== 'object') {
                        child = {'title': child};
                    }
                    var active = child.title === this.state.active;
                    var NodeType = TreeNode;
                    if (!child.contents || child.contents.length === 0) {
                        NodeType = this.state.dragNode;
                    }
                    return <NodeType {...child}
                                     dragNode={this.state.dragNode} active={active} key={ind}
                                     activate={(p) => { this.setState({'active': p[0]}); this.props.activate(p); }} />
                })}
            </ul>
        );
    }
}

Tree.defaultProps = {
    disclosed: true
}
