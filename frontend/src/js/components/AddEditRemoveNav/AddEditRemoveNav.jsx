/* globals $ */
import React from 'react'
import "./AddEditRemoveNav.scss"

var AddEditRemoveNav = React.createClass({
    propTypes:{
        addAction: React.PropTypes.func,
        editAction: React.PropTypes.func,
        removeAction: React.PropTypes.func,
        addText: React.PropTypes.string,
        editText: React.PropTypes.string,
        removeText: React.PropTypes.string,
        title: React.PropTypes.string
    },
    render() {
        return (
            <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div>
                            <ul className="nav navbar-nav navbar-right side-nav">
                                <li>
                                    <a href='#' onClick={this.props.addAction} title={this.props.addText ? this.props.addText : ""}>
                                        <i className='glyphicon glyphicon-plus-sign'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.props.editAction} title={this.props.editText ? this.props.editText : ""}>
                                        <i className='glyphicon glyphicon-edit'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.props.removeAction} title={this.props.removeText ? this.props.removeText : ""}>
                                        <i className='glyphicon glyphicon-remove-sign'></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <p className='side-nav-header'>{this.props.title}</p>
                    </div>
                </nav>

        )
    }
})

export default AddEditRemoveNav;
