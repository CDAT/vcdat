import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

var cur_gmProps = null;

var GraphicsMethodEditForm = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object
    },
    onChange(event) {
        var property_name = event.target.name;
        if (!cur_gmProps) {
            cur_gmProps = Object.assign({}, this.props.gmProps);
        }
        if (event.target.type === 'checkbox') {
            cur_gmProps[property_name] = event.target.checked;
        }
        else {
            cur_gmProps[property_name] = event.target.value;
        }
        console.log(cur_gmProps[property_name])
        console.log(this.props.gmProps[property_name])
    },
    populateTable() {
        console.log("populateTable()");
        var gmProps = this.props.gmProps
        var table_contents = Object.keys(gmProps).map((key, index) => {
            switch(key) {
                case 'boxfill_type':
                    let linear_checked = false;
                    let log10_checked = false;
                    let custom_checked = false;
                    if (gmProps[key] === 'linear')
                        linear_checked = true;
                    else if (gmProps[key] === 'log10')
                        log10_checked = true;
                    else if (gmProps[key] === 'custom')
                        custom_checked = true;
                    return (
                        <tr key={key+index+Date.now()}>
                            <td>
                                Boxfill type:
                            </td>
                            <td>
                                {
                                    linear_checked
                                        ?   <input type='radio'
                                                name='boxfill_type'
                                                value='linear'
                                                id="bf-linear"
                                                onChange={this.onChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='linear'
                                                id="bf-linear"
                                                onChange={this.onChange}/>
                                        } linear
                            </td>
                            <td>
                                {
                                    log10_checked
                                        ?   <input type='radio'
                                                name='boxfill_type'
                                                value='log10'
                                                id="bf-log10"
                                                onChange={this.onChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='log10'
                                                id="bf-log10"
                                                onChange={this.onChange}/>
                                }  log10
                            </td>
                            <td>
                                {
                                    custom_checked
                                        ?   <input type='radio'
                                                name='boxfill_type'
                                                value='custom'
                                                id="bf-custom"
                                                onChange={this.onChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='custom'
                                                id="bf-custom"
                                                onChange={this.onChange}/>
                                } custom
                            </td>
                        </tr>
                    );
                case 'color_1':
                    return (
                        <tr key={'colors'+index+Date.now()}>
                            <td>
                                Color 1: <input type="number"
                                                name="color_1"
                                                defaultValue={gmProps["color_1"]}
                                                onChange={this.onChange} />
                            </td>
                            <td>
                                Color 2: <input type="number"
                                                name="color_2"
                                                defaultValue={gmProps["color_2"]}
                                                onChange={this.onChange} />
                            </td>
                        </tr>
                    );
                case 'colormap':
                    // need to have a list of available colormaps here
                    break;
                // ASSUMPTION: all datawc fields will be present in any GM with one datawc field
                case 'datawc_calendar':
                case 'datawc_timeunits':
                case 'datawc_x1':
                    // datawcs here
                    break;
                case 'ext_1':
                    var ext1 = gmProps['ext_1'];
                    var ext2 = gmProps['ext_2'];
                    var key = 'exts'+Date.now()
                    if (ext1 && ext2) {
                        return (
                            <tr key={key}>
                                <td>
                                    Ext 1: <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                </td>
                                <td>
                                    Ext 2: <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                </td>
                            </tr>
                        )
                    }
                    else if (ext1) {
                        return (
                            <tr key={key}>
                                <td>
                                    Ext 1: <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                </td>
                                <td>
                                    Ext 2: <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}/>
                                </td>
                            </tr>
                        )
                    }
                    else if (ext2) {
                        return (
                            <tr key={key}>
                                <td>
                                    Ext 1: <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                    Ext 2: <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                </td>
                            </tr>
                        )
                    }
                    else {
                        return (
                            <tr key={key}>
                                <td>
                                    Ext 1: <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}/>
                                </td>
                                <td>
                                    Ext 2: <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}/>
                                </td>
                            </tr>
                        )
                    }
                case 'fillareacolors':
                    break;
                case 'fillareaindices':
                    break;
                case 'fillareaopacity':
                    break;
                case 'fillareastyle':
                    break;
                case 'legend':
                    break;
                case 'level_1':
                    return (
                        <tr key={"level_1_2"+index+Date.now()}>
                            <td>
                                Level 1: <input type="number"
                                    name="level_1"
                                    defaultValue={
                                        gmProps["level_1"] > 1e4
                                        ? gmProps["level_1"].toExponential()
                                        : gmProps["level_1"]
                                    }
                                    onChange={this.onChange}/>
                            </td>
                            <td>
                                Level 2: <input type="number"
                                    name="level_2"
                                    defaultValue={
                                        gmProps["level_2"] > 1e4
                                        ? gmProps["level_2"].toExponential()
                                        : gmProps["level_2"]
                                    }
                                    onChange={this.onChange}/>
                            </td>
                        </tr>
                    );
                case 'levels':
                    break;
                case 'missing':
                    return (
                        <tr key={key+index+Date.now()}>
                            <td>Missing: </td>
                            <td><input type='number'
                                            name='missing'
                                            defaultValue={gmProps[key]}
                                            onChange={this.onChange}/></td>
                        </tr>
                    )
                case 'projection':
                    break;
                case 'xaxisconvert':
                case 'yaxisconvert':
                    break;
                case 'xmtics1':
                case 'xmtics2':
                case 'ymtics1':
                case 'ymtics2':
                    break;
                case "xticlabels1":
                case "xticlabels2":
                case "yticlabels1":
                case "yticlabels2":
                    break;
            }
        });
        return table_contents;
    },
    render() {
        return(
            <table className={this.props.graphicsMethod}>
                <tbody>
                    {this.populateTable()}
                </tbody>
            </table>
        )
    }
});

const mapStateToProps = (state) => {
    return {
        gmProps: state.present.active_GM.gmProps,
        graphicsMethod: state.present.active_GM.gm,
        graphicsMethodParent: state.present.active_GM.gmParent
    }
}

export default connect(mapStateToProps)(GraphicsMethodEditForm);
