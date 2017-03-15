import React, { Component } from 'react';

class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disclosed: false
        };
    }
    clicked() {
        if (!this.state.disclosed || !this.props.children.length) {
            this.props.activate([this.props.title]);
        }
        if (this.props.children) {
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
        var is_node = this.props.children && this.props.children.length;
        var classnames = [is_node ? "tree-node":"tree-leaf"];
        if (disclosed) {
            classnames.push("disclosed");
        }
        if (active === true && !is_node) {
            classnames.push("active");
        }

        return (
            <li className={classnames.join(" ")}>
                <a onClick={(e) => this.clicked()}>{this.props.title}</a>
                {is_node ? <Tree disclosed={disclosed} activate={(p) => this.activateChild(p)} contents={this.props.children} /> : "" }
            </li>
        );
    }
}

export default class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.disclosed === false) {
            this.setState({"active": false});
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
                    var contents, title;
                    if (child.contents) {
                        contents = child.contents;
                        title = child.title;
                    } else {
                        title = child;
                    }
                    var active = title === this.state.active;
                    return <TreeNode active={active} key={ind} title={title} children={contents}
                                     activate={(p) => { this.setState({'active': p[0]}); this.props.activate(p); }} />
                })}
            </ul>
        );
    }
}

Tree.defaultProps = {
    disclosed: true
}
