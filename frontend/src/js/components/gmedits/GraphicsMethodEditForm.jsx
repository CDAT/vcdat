import React from 'react'
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
        var gmProps = this.props.gmProps
        var table_contents = Object.keys(gmProps).map((key, index) => {
            switch(key) {
                case 'boxfill_type':
                    return (
                        <tr key={key+index}>
                            <td>
                                Boxfill type:
                            </td>
                            <td>
                                <input type='radio'
                                    name='boxfill_type'
                                    value='linear'
                                    id="bf-linear"
                                    onChange={this.onChange}/> linear
                            </td>
                            <td>
                                <input type='radio'
                                    name='boxfill_type'
                                    value='log10'
                                    id="bf-log10"
                                    onChange={this.onChange}/> log10
                            </td>
                            <td>
                                <input type='radio'
                                    name='boxfill_type'
                                    value='custom'
                                    id="bf-custom"
                                    onChange={this.onChange}/> custom
                            </td>
                        </tr>
                    );
                case 'color_1':
                case 'color_2':
                    break;
                case 'colormap':
                    break;
                // ASSUMPTION: all datawc fields will be present in any GM with one datawc field
                case 'datawc_calendar':
                case 'datawc_timeunits':
                case 'datawc_x1':
                case 'datawc_x2':
                case 'datawc_y1':
                case 'datawc_y2':
                    break;
                case 'ext_1':
                    var ext1 = gmProps['ext_1'];
                    var ext2 = gmProps['ext_2'];
                    if (ext1 && ext2) {
                        return (
                            <tr key={'exts'}>
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
                            <tr key={'exts'}>
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
                            <tr key={'exts'}>
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
                            <tr key={'exts'}>
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
                case 'level_2':
                    break;
                case 'missing':
                    return (
                        <tr key={key+index}>
                            <td>Missing: </td>
                            <td><input type='number'
                                            name='missing'
                                            defaultValue={gmProps[key]}
                                            onChange={this.onChange}/></td>
                        </tr>
                    )
                    break;
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
            <table>
                <tbody>
                    {this.populateTable()}
                </tbody>
            </table>
        )
    }
});

export default GraphicsMethodEditForm;
