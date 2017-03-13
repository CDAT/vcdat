import React, { Component } from 'react';

/*
    A react-y replacement for Quicktree.

    You pass in a nested dictionary to Tree, and it will turn it into a tree of nested components.
    When you click on an item, it becomes active. It will also display its children. The activation
    will echo up the chain to the root of the tree (which will not receive an "active" status, because
    that would be weird). Each level of the tree will disable everything that isn't the new active child.

    You use it like this:

    var data = {'my': {'nested': {'values': ['are', 'super', 'cool']}}};
    return ( <Tree contents={data} title="Awesome Tree" /> );
*/


export default class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'disclosed': this.props.disclosed ? true : false,
            'active': this.props.active ? true : false
        }
        if (props.titleAttribute === undefined) {
            this.state.titleAttribute = "title";
        } else {
            this.state.titleAttribute = props.titleAttribute;
        }
        if (props.contentsAttribute === undefined) {
            this.state.contentsAttribute = "contents";
        } else {
            this.state.contentsAttribute = props.contentsAttribute;
        }
    }
    componentWillReceiveProps(nextProps) {
        const new_state = {};
        if (nextProps["active"] !== undefined) {
            // If we pass a new "active" state down, honor it.
            new_state["active"] = nextProps["active"];
        }
        this.setState(new_state);
    }
    clicked() {
        // We have to do two things:
        // Toggle the disclosed state
        // Update the active status
        if (this.state.disclosed) {
            this.setState({'disclosed': false, 'active': false});
        } else {
            this.setState({'disclosed': true, 'active': true});
            if (this.props.onActivate) {
                // Now bubble up an activation
                this.props.onActivate([this.props.title]);
            }
        }
    }
    onActivate(activatePath) {
        this.setState({"active": true, "activeChild": activatePath[0]});
        if (this.props.activate) {
            activatePath.unshift(this.props.title);
            this.props.activate(activatePath);
        }
    }
    render() {
        let activate = this.onActivate.bind(this);
        let children = this.props.contents.map((con, ind) => {
            if (typeof con === "string") {
                let className = "";
                if (this.state.active && this.state.activeChild == con) {
                    className = "active";
                }
                return <li className={className} key={ind} onClick={(e) => {activate([con]);}}>{con}</li>;
            } else {
                // Use props to determine which keys to use for what
                const title = con[this.state.titleAttribute];
                const contents = con[this.state.contentsAttribute];
                const props = { title, contents };
                if (!this.state.disclosed) {
                    props["active"] = false;
                }
                if (this.state.active && this.state.activeChild === title) {
                    props["active"] = true;
                }
                props["activate"] = activate;
                return <li key={ind}><Tree {...props} /></li>
            }
        });

        const style = {
            display: this.state.disclosed ? 'block' : 'none'
        };

        return (
            <div className={this.state.active ? 'active' : ''}>
                <a onClick={(e) => {this.clicked();}}>{this.props.title}</a>
                <ul style={style}>
                    {children}
                </ul>
            </div>
        );
    }
}
