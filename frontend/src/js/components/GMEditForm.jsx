import React from 'react'

var GMEditForm = React.createClass({
    propTypes:{
        gmProps: React.PropTypes.object
    },
    populateForm() {
        let settings = this.props.gmProps;
        let form_content = Object.keys(settings).map(function (value, index) {
            // getGMSettings()
            let entry = [];
            let defaults = settings[value]["defaults"]
            let data_type = settings[value]["data-type"]
            if (Array.isArray(defaults)) {
                // this should be a dropdown
                // get basics done, then come back and add sections for adding customs
                if (Number.isInteger(defaults[0]) && defaults[0] >= 1e4) {
                    defaults[0] = defaults[0].toExponential()
                }
                entry.push(
                    <div>
                        <b>{value}: </b>
                        <select defaultValue={defaults[0]} >
                            {
                                defaults.map(function (element, index) {
                                    return (
                                        <option key={value + '[' + index + ']'}
                                            value={element}>
                                                {
                                                    Number.isInteger(element) && element >= 1e4
                                                    ? element.toExponential()
                                                    : element
                                                }
                                        </option>
                                    )
                                })
                            }
                        </select>
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
                            ? <input type={input_type}
                                defaultValue={defaults}
                                defaultChecked/>
                            : <input type={input_type}
                                defaultValue={defaults}/>
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
