import React from 'react'

var ColormapField = React.createClass({
    propTypes: {
        defaultValue: React.PropTypes.string,
        handleChange: React.PropTypes.func
    },
    render() {
        return (
            <div>
                <h5>Colormap: </h5>
                <select name="colormap"
                    value={
                        this.props.defaultValue
                        ? this.props.defaultValue
                        : 'rainbow'}
                    onChange={this.props.handleChange}
                    className='form-control'>
                    <option value='AMIP'>AMIP</option>
                    <option value='NCAR'>NCAR</option>
                    <option value='bl_to_darkred'>bl_to_darkred</option>
                    <option value='bl_to_drkorang'>bl_to_drkorang</option>
                    <option value='blue_to_grey'>blue_to_grey</option>
                    <option value='blue_to_grn'>blue_to_grn</option>
                    <option value='blue_to_orange'>blue_to_orange</option>
                    <option value='blue_to_orgred'>blue_to_orgred</option>
                    <option value='brown_to_blue'>brown_to_blue</option>
                    <option value='categorical'>categorical</option>
                    <option value='default'>Default</option>
                    <option value='grn_to_magenta'>grn_to_magenta</option>
                    <option value='ltbl_to_drkbl'>ltbl_to_drkbl</option>
                    <option value='rainbow'>rainbow</option>
                    <option value='rainbow_no_grn'>rainbow_no_grn</option>
                    <option value='sequential'>sequential</option>
                    <option value='white_to_blue'>white_to_blue</option>
                    <option value='white_to_green'>white_to_green</option>
                    <option value='white_to_magenta'>white_to_magenta</option>
                    <option value='white_to_red'>white_to_red</option>
                    <option value='white_to_yellow'>white_to_yellow</option>
                </select>
            </div>
        );
    }
});

export default ColormapField;
