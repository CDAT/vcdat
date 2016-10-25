import React from 'react'

var FillareaFields = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        defaultValue: React.PropTypes.string,
        className: React.PropTypes.string,
        colors: React.PropTypes.array,
        style: React.PropTypes.string,
        indices: React.PropTypes.array,
        opacity: React.PropTypes.array

    },
    getInitialState() {
        return {
            colors: [],
            style: '',
            indices: [],
            opacity: []
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            colors: nextProps.colors,
            style: nextProps.style,
            indices: nextProps.indices,
            opacity: nextProps.opacity
        })
    },
    handleChange(event) {

        this.props.handleChange(event);
    },
    render(){
        return (
            <div id='fillarea-fields' className={this.props.className}>
                <div className='row'>
                    <div className='col-md-6'>
                        <h5>Patterns: </h5>
                        <input type='text'
                            name='fillareaindices'
                            value={this.state.indices? this.state.indices : []}
                            onChange={(event)=> {this.setState({indices:event.target.value})}}
                            onBlur={this.props.handleChange}/>
                    </div>
                    <div className='col-md-6'>
                        <h5>Type: </h5>
                        <select name='fillareastyle'
                            value={this.state.style ?this.state.style :'solid'}
                            onChange={this.handleChange}
                            className='form-control'>
                            <option value='solid'>solid</option>
                            <option value='hatch'>hatch</option>
                            <option value='pattern'>pattern</option>
                        </select>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <h5>Colors: </h5>
                        <input type='text'
                            name='fillareacolors'
                            value={this.state.colors? this.state.colors : []}
                            onChange={(event)=> {this.setState({colors:event.target.value})}}
                            onBlur={this.props.handleChange}/>
                    </div>
                    <div className='col-md-6'>
                        <h5>Fillareaopacity: </h5>
                        <input type='text'
                            name='fillareaopacity'
                            value={this.state.opacity? this.state.opacity : []}
                            onChange={(event)=> {this.setState({opacity:event.target.value})}}
                            onBlur={this.props.handleChange}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default FillareaFields;
