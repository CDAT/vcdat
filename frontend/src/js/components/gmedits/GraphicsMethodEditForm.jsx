import React from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions/Actions.js'
import $ from 'jquery'

var GraphicsMethodEditForm = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object,
        updateActiveGM: React.PropTypes.func
    },
    onChange(event) {
        var property_name = event.target.name;
        var cur_gmProps = Object.assign({}, this.props.gmProps);
        if (event.target.type === 'checkbox') {
            cur_gmProps[property_name] = event.target.checked;
        }
        else {
            cur_gmProps[property_name] = event.target.value;
        }
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
        console.log(cur_gmProps[property_name], typeof(cur_gmProps[property_name]));
    },
    populateTable() {
        console.log('populateTable()')
        var gmProps = this.props.gmProps
        let converts = ['linear', 'log10', 'ln', 'exp', 'area_wt']
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
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>
                                Boxfill type:
                            </h5>

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
                        </div>
                    );
                case 'color_1':
                    return (
                        <div key={'colors'+index+(Date.now()/Math.random())}>
                            <h5>
                                Color 1:
                            </h5>
                                <input type="number"
                                    name="color_1"
                                    defaultValue={gmProps["color_1"]}
                                    onChange={()=>{}}
									onChange={()=>{}}
									onBlur={this.onChange} />
                            <h5>Color 2:</h5>

                                <input type="number"
                                    name="color_2"
                                    defaultValue={gmProps["color_2"]}
                                    onChange={()=>{}}
									onBlur={this.onChange} />
                        </div>
                    );
                case 'colormap':
                    // need to have a list of available colormaps here
                    return (
                        <div key={'colormaps'+(Date.now()/Math.random())}>
                            <h5>Colormap: </h5>
                            <select name="colormap" defaultValue={gmProps[key]} onChange={this.onChange}>
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
                case 'datawc_calendar':
                    return (
                        <div key={'datawc_calendar'+(Date.now()/Math.random())}>
                            <h5>datawc_calendar: </h5>
                            <input name='datawc_calendar'
                                type='number'
                                defaultValue={gmProps[key]}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                        </div>
                    );
                case 'datawc_timeunits':
                    return (
                        <div key={'datawc_timeunits'+(Date.now()/Math.random())}>
                            <h5>datawc_timeunits: </h5>
                            <input name='datawc_timeunits'
                                type='text'
                                defaultValue={gmProps[key]}
                                onChange={() => {}}
								onBlur={this.onChange}/>
                        </div>
                    );
                case 'datawc_x1':
                    // worldcoordinates here
                    return (
                            <div key={"worldcoordinates"+index+(Date.now()/Math.random())}>
                                <h5> datawc_x1: </h5>
                                    <input type="text"
                                        name="datawc_x1"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_x1"]) && gmProps["datawc_x1"] > 1e4
                                            ? gmProps["datawc_x1"].toExponential()
                                            : gmProps["datawc_x1"]
                                        }
                                        onChange={()=>{}}
                                        onBlur={this.onChange}/> <br/>
                                    <h5>datawc_x2: </h5>
                                    <input type="text"
                                        name="datawc_x2"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_x2"]) && gmProps["datawc_x2"] > 1e4
                                            ? gmProps["datawc_x2"].toExponential()
                                            : gmProps["datawc_x2"]
                                        }
                                        onChange={()=>{}}
                                        onBlur={this.onChange}/> <br/>

                                    <h5>datawc_y1: </h5>
                                    <input type="text"
                                        name="datawc_y1"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_y1"]) && gmProps["datawc_y1"] > 1e4
                                            ? gmProps["datawc_y1"].toExponential()
                                            : gmProps["datawc_y1"]
                                        }
                                        onChange={()=>{}}
                                        onBlur={this.onChange}/> <br/>
                                    <h5>datawc_y2: </h5>
                                    <input type="text"
                                        name="datawc_y2"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_y2"]) && gmProps["datawc_y2"] > 1e4
                                            ? gmProps["datawc_y2"].toExponential()
                                            : gmProps["datawc_y2"]
                                        }
                                        onChange={()=>{}}
                                        onBlur={this.onChange}/> <br/>
                            </div>
                    );
                case 'ext_1':
                    var ext1 = gmProps['ext_1'];
                    var ext2 = gmProps['ext_2'];
                    var uniq_key = 'exts'+(Date.now()/Math.random())
                    if (ext1 && ext2) {
                        return (
                            <div key={uniq_key}>
                                <h5>
                                    Ext 1:
                                </h5>
                                    <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}
                                        defaultChecked/><br/>
                                <h5>
                                    Ext 2:
                                </h5>
                                    <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}
                                        defaultChecked/>

                            </div>
                        )
                    }
                    else if (ext1) {
                        return (
                            <div key={uniq_key}>
                                <h5>
                                    Ext 1:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                    <br/>
                                <h5>
                                    Ext 2:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}/>
                                    <br/>
                            </div>
                        )
                    }
                    else if (ext2) {
                        return (
                            <div key={uniq_key}>
                                <h5>
                                    Ext 1:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}/>
                                    <br/>
                                <h5>
                                    Ext 2:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}
                                        defaultChecked/>
                                    <br/>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div key={uniq_key}>
                                <h5>
                                    Ext 1:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_1"
                                        onChange={this.onChange}/>
                                    <br/>
                                <h5>
                                    Ext 2:
                                </h5>

                                    <input type="checkbox"
                                        name="ext_2"
                                        onChange={this.onChange}/>
                                    <br/>
                            </div>
                        )
                    }
                case 'fillareacolors':
                    break;
                case 'fillareaindices':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Fillareaindices: </h5>
                            <input type='text'
                                name={key}
                                defaultValue={gmProps[key]}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                        </div>
                    );
                    break;
                case 'fillareaopacity':
                    break;
                case 'fillareastyle':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}
                            className={
                                gmProps['boxfill_type'] === 'custom'
                                ? ''
                                :'hide'}>
                            <h5>Fillareastyle: </h5>
                            <select name={key} defaultValue={gmProps[key]} onChange={this.onChange}>
                                <option value='solid'>solid</option>
                                <option value='hatch'>hatch</option>
                                <option value='pattern'>pattern</option>
                            </select>
                        </div>
                    );
                case 'legend':
                    break;
                case 'level_1':
                    return (
                        <div key={"level_1_2"+index+(Date.now()/Math.random())}>
                            <h5>
                                Level 1:
                            </h5>

                                <input type="text"
                                    name="level_1"
                                    defaultValue={
                                        Number.isInteger(gmProps["level_1"]) && gmProps["level_1"] > 1e4
                                        ? gmProps["level_1"].toExponential()
                                        : gmProps["level_1"]
                                    }
                                    onChange={()=>{}}
									onBlur={this.onChange}/>
                                <br/>
                            <h5>
                                Level 2:
                            </h5>

                                <input type="text"
                                    name="level_2"
                                    defaultValue={
                                        Number.isInteger(gmProps["level_2"]) && gmProps["level_2"] > 1e4
                                        ? gmProps["level_2"].toExponential()
                                        : gmProps["level_2"]
                                    }
                                    onChange={()=>{}}
									onBlur={this.onChange}/>

                        </div>
                    );
                case 'levels':
                    break;
                case 'missing':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Missing: </h5>
                            <input type='number'
                                name='missing'
                                defaultValue={gmProps[key]}
                                onChange={()=>{}}
								onBlur={this.onChange}/><br/>
                        </div>
                    );
                case 'projection':
                    return (
                        <div key={'projections'+(Date.now()/Math.random())}>
                            <h5>Projection: </h5>
                            <select name="projection" defaultValue={gmProps[key]} onChange={this.onChange}>
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
                case 'xaxisconvert':
                    var defaultXConvert = gmProps['xaxisconvert'];
                    var defaultYConvert = gmProps['yaxisconvert'];
                    var that = this;
                    return (
                        <div key={'axisconvert'+Date.now()/Math.random()}>
                            <h5>X axis transform: </h5>
                            {
                                converts.map((convert) => {
                                    return (
                                            <span key={'xconvert'+Date.now()/Math.random()}>
                                                {
                                                    convert === defaultXConvert
                                                    ? <input name='xaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.onChange}
                                                        defaultChecked/>
                                                    : <input name='xaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.onChange}/>
                                                }
                                                {convert}
                                              </span>
                                    );
                                })
                            }
                            <h5>Y axis transform: </h5>
                            {
                                converts.map((convert) => {
                                    return (
                                            <span key={'yconvert'+Date.now()/Math.random()}>
                                                {
                                                    convert === defaultYConvert
                                                    ? <input name='yaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.onChange}
                                                        defaultChecked/>
                                                    : <input name='yaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.onChange}/>
                                                }
                                                {convert}
                                              </span>
                                    );
                                })
                            }
                        </div>
                    );
                case 'xmtics1':
                    return (
                        <div key={'mtics'+Date.now()/Math.random()}>
                            <h5>xmtics1: </h5>
                            <input name='xmtics1'
                                type='text'
                                defaultValue={gmProps['xmtics1']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>xmtics2: </h5>
                            <input name='xmtics2'
                                type='text'
                                defaultValue={gmProps['xmtics2']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>ymtics1: </h5>
                            <input name='ymtics1'
                                type='text'
                                defaultValue={gmProps['ymtics1']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>ymtics2: </h5>
                            <input name='ymtics2'
                                type='text'
                                defaultValue={gmProps['ymtics2']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                        </div>
                    );
                case "xticlabels1":
                    return (
                        <div key={'ticlabels'+Date.now()/Math.random()}>
                            <h5>xticlabels1: </h5>
                            <input name='xticlabels1'
                                type='text'
                                defaultValue={gmProps['xticlabels1']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>xticlabels2: </h5>
                            <input name='xticlabels2'
                                type='text'
                                defaultValue={gmProps['xticlabels2']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>yticlabels1: </h5>
                            <input name='yticlabels1'
                                type='text'
                                defaultValue={gmProps['yticlabels1']}
                                onChange={()=>{}}
								onBlur={this.onChange}/>
                            <h5>yticlabels2: </h5>
                            <input name='yticlabels2'
                                type='text'
                                defaultValue={gmProps['yticlabels2']}
                                onBlur={this.onChange}/>
                        </div>
                    );
                default:
                    return;
            }
        });
        return table_contents;
    },
    // should change render to return multiple tables,
    // with certain contents from the array returned from populateTables()
    render() {
        return(
            <div>
                <div className='modal-body'>
                        {this.populateTable()}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => {
    return {
        gmProps: state.present.active_GM.gmProps,
        graphicsMethod: state.present.active_GM.gm,
        graphicsMethodParent: state.present.active_GM.gmParent,
    }
}
// Add these to the state with a dispatch that calls backend to get valid colormap/projection lists
// colormaps: state.present.colormaps,
// projections: state.present.projections

const mapDispatchToProps = (dispatch) => {
    return {
        updateActiveGM: (gmProps, gmParent, gm) => dispatch(Actions.updateActiveGM(gmProps, gmParent, gm))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphicsMethodEditForm);
