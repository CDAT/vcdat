import React from 'react'

var NOP = ()=>{}
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
    getDefaultProps() {
        return {
            colors: []
        }
    },
    render(){
        return (
            <div id='fillarea-fields' className={this.props.className}>
                <div>
                    <h5>Fillareacolors: </h5>
                    <input type='text'
                        name='fillareacolors'
                        defaultValue={this.props.colors}
                        onChange={NOP}
                        onBlur={this.props.handleChange}/>
                </div>
                <div>
                    <h5>Fillareaindices: </h5>
                    <input type='text'
                        name='fillareaindices'
                        defaultValue={this.props.indices}
                        onChange={NOP}
                        onBlur={this.props.handleChange}/>
                </div>
                <div>
                    <h5>Fillareaopacity: </h5>
                    <input type='text'
                        name='fillareaopacity'
                        defaultValue={this.props.opacity}
                        onChange={NOP}
                        onBlur={this.props.handleChange}/>
                </div>
                <div >
                    <h5>Fillareastyle: </h5>
                    <select name='fillareastyle' defaultValue={this.props.style} onChange={this.props.handleChange}>
                        <option value='solid'>solid</option>
                        <option value='hatch'>hatch</option>
                        <option value='pattern'>pattern</option>
                    </select>
                </div>
            </div>
        );
    }
});

export default FillareaFields;
