import React from 'react'

var GMEditForm = React.createClass({
    propTypes:{

    },
    gm_settings: {
        "boxfill": {
            "type": {
                "defaults": ["linear", "log10", "custom"],
                "data-type": "String"
            },
            "color_1": {
                "defaults":16,
                "data-type": "Number",
            },
            "color_2": {
                "defaults":239,
                "data-type": "Number",
            },
            "colormap": {
                "defaults":null,
                "data-type": "String",
            },
            "datawc_calendar": {
                "defaults":135441,
                "data-type": "Number",
            },
            "datawc_timeunits": {
                "defaults": "days since 2000",
                "data-type": "String",
            },
            "datawc_x1": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "datawc_x2": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "datawc_y1": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "datawc_y2": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "ext_1": {
                "defaults":true,
                "data-type": "Boolean",
            },
            "ext_2": {
                "defaults":false,
                "data-type": "Boolean",
            },
            "fillareacolors": {
                "defaults": null,
                "data-type": "Number",
            },
            "fillareaindices": {
                "defaults": [1],
                "data-type": "Number",
            },
            "fillareaopacity": {
                "defaults": [],
                "data-type": "Number",
            },
            "fillareastyle": {
                "defaults": ["solid", "hatch", "pattern"],
                "data-type": "String",
            },
            "legend": {
                "defaults": null,
                "data-type": "Object",
            },
            "level_1": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "level_2": {
                "defaults":1e+20,
                "data-type": "Number",
            },
            "levels": {
                "defaults": [1e+20, 1e+20],
                "data-type": "Number",
            },
            "missing": {
                "defaults": 1,
                "data-type": "Number",
            },
            "projection": {
                "defaults": "linear",
                "data-type": "String",
            },
            "xaxisconvert": {
                "defaults": "linear",
                "data-type": "String",
            },
            "xmtics1": {
                "defaults": "",
                "data-type": "Object",
            },
            "xmtics2": {
                "defaults": "",
                "data-type": "Object",
            },
            "xticlabels1": {
                "defaults": "*",
                "data-type": "Object",
            },
            "xticlabels2": {
                "defaults": "*",
                "data-type": "Object",
            },
            "yaxisconvert": {
                "defaults": "linear",
                "data-type": "Object",
            },
            "ymtics1": {
                "defaults": "",
                "data-type": "Object",
            },
            "ymtics2": {
                "defaults": "",
                "data-type": "Object",
            },
            "yticlabels1": {
                "defaults": "*",
                "data-type": "Object",
            },
            "yticlabels2": {
                "defaults": "*",
                "data-type": "Object",
            },
        }
    },
    props: {
        // Might want to change this into a backend call to populate a json based on props.graphicsMethodParent
    },
    populateForm() {
        let settings = this.gm_settings['boxfill']
        let form_content = Object.keys(settings).map(function (value, index) {
            // getGMSettings()
            let entry = [];
            let defaults = settings[value]["defaults"]
            let data_type = settings[value]["data-type"]
            if (Array.isArray(defaults)) {
                // this should be a dropdown
                // get basics done, then come back and add sections for adding customs
                // start the dropdown
                if (Number.isInteger(defaults[0]) && defaults[0] >= 1e4) {
                    defaults[0] = defaults[0].toExponential()
                }
                entry.push(
                    <div>
                        <b>{value}: </b>
                        <div className='dropdown-container'>
                            <button type="button" className="btn btn-info dropdown-toggle dropdown-button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className='inspector-dropdown-title'>{defaults[0]}</span>
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                {
                                    defaults.map(function (element, index){
                                        return (
                                            <li key={value + '[' + index + ']'}>
                                                {
                                                    Number.isInteger(element) && element >= 1e4
                                                    ? element.toExponential()
                                                    : element
                                                }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                );
            }
            else if(data_type !== "Object"){
                // this should be a text entry field
                // use data-type to restrict inputs?
                let input_type = ""
                let input_checked = false
                if (data_type === "String") {
                    input_type = "text"
                } else if(data_type === "Number"){
                    input_type = "number"
                    if (Number.isInteger(defaults) && defaults >= 1e4 && value != "datawc_calendar"){
                        defaults = defaults.toExponential();
                    }
                } else {
                    // data_type is Boolean
                    input_type = "checkbox"
                    if (defaults === true) {
                        input_checked = true;
                    }
                }
                entry.push(
                    <div>
                        <b>{value}: </b>
                        {
                            input_checked
                            ? <input type={input_type} defaultValue={defaults} defaultChecked></input>
                            : <input type={input_type} defaultValue={defaults}></input>
                        }
                    </div>
                );
            }
            else {
                // Object data is weird. Don't know what to do here yet.
            }
            return entry;
        });
        return form_content;
    },
    render() {
        return (
            <form>
                {this.populateForm()}
            </form>
        )
    }

});

export default GMEditForm;
/*
<div className='dropdown-container'>
    <button type="button" className="btn btn-info dropdown-toggle dropdown-button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className='inspector-dropdown-title'>{this.props.graphicsMethodParent}</span>
        <span className="caret"></span>
    </button>
    <ul className="dropdown-menu">
        {Object.keys(this.props.graphicsMethods).map((value, index) => {
            return (
                <li onClick={this.props.changePlotGM.bind(this, true, value)}
                    key={'inspector_gmp_' + value}
                    className={
                        'inspector-dropdown-item ' + (
                            value === this.props.graphicsMethodParent
                            ? 'active'
                            : '')
                    }>
                        {value}
                </li>
            )
        })}
    </ul>
</div>
*/
