import React from 'react'


var AddEditRemoveNav = React.createClass({
    propTypes:{
        addAction: React.PropTypes.func,
        title: React.PropTypes.string
    },
    render() {
        return (
            <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div>
                            <ul className="nav navbar-nav navbar-right side-nav">
                                <li>
                                    <a href='#' onClick={this.props.addAction}>
                                        <i className='glyphicon glyphicon-plus-sign'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#"><i className='glyphicon glyphicon-edit'></i></a>
                                </li>
                                <li>
                                    <a href="#"><i className='glyphicon glyphicon-remove-sign'></i></a>
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
