import React from 'react'

var Projection = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        projection: React.PropTypes.string
    },
    render() {
        return (
            <div id='projection-selector'>
                <h5>Projection: </h5>
                <select name="projection" defaultValue={this.props.projection} onChange={this.props.handleChange}>
                    <option value='default'>Default</option>
                    <option value='lambert'>Lambert</option>
                    <option value='linear'>Linear</option>
                    <option value='mercator'>Mercator</option>
                    <option value='mollweide'>Mollweide</option>
                    <option value='orthographic'>Orthographic</option>
                    <option value='polar'>Polar</option>
                    <option value='polyconic'>Polyconic</option>
                    <option value='robinson'>Robinson</option>
                </select>
            </div>
        );
    }
});

export default Projection;
