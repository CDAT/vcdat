import React from 'react'

var GMList = React.createClass({
    componentDidMount(){
        $('#gm-list').quicktree();
    },
    render() {
        return (
            <div className='left-side-list scroll-area-list-parent'>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">

                        <div className="">
                            <ul className="nav navbar-nav navbar-right side-nav">
                                <li>
                                    <a href="#"><i className='glyphicon glyphicon-plus-sign'></i></a>
                                </li>
                                <li>
                                    <a href="#"><i className='glyphicon glyphicon-edit'></i></a>
                                </li>
                                <li>
                                    <a href="#"><i className='glyphicon glyphicon-remove-sign'></i></a>
                                </li>
                            </ul>
                        </div>
                        <p className='side-nav-header'>Graphics Methods</p>
                    </div>
                </nav>
                <div className='scroll-area'>
                <ul id='gm-list' className='no-bullets left-list'>
                    {Object.keys(this.props.graphicsMethods).map((value, index) => {
                        return (<li key={value} className='main-left-list-item'><a>{value}</a>
                            <ul className='no-bullets'>
                                {this.props.graphicsMethods[value].map((value, index) =>{
                                    return <li key={value} className='sub-left-list-item'><a>{value}</a></li>
                                })}
                            </ul>
                        </li>)
                    })}
                </ul>
            </div>
            </div>
        )
    }
});

export default GMList;
