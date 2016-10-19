import React from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions/Actions.js'
import $ from 'jquery'

var NOP = ()=>{}
var GraphicsMethodEditForm = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object,
        updateActiveGM: React.PropTypes.func
    },
    componentWillUpdate() {
        $("#commit-gm-edits").prop("disabled", true)
    },
    componentDidUpdate() {
        $("#commit-gm-edits").prop("disabled", false)
    },
    addLevel() {
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        cur_gmProps['levels'] = cur_gmProps['levels'].concat('');
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
    },
    removeLevel(event) {
        let index = Number.parseInt(event.target.getAttribute('data-index'));
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        let cur_levels = cur_gmProps['levels'];
        let new_levels = cur_levels.slice(0, index).concat(cur_levels.slice((index + 1), cur_levels.length));
        cur_gmProps['levels'] = new_levels;
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
    },
    handleChange(event) {
        let property_name = event.target.name;
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        if (event.target.type === 'checkbox') {
            cur_gmProps[property_name] = event.target.checked;
        }
        else if (property_name.match(/levels_[0-9]+/)) {
            let level_index = Number.parseInt(property_name.split('_')[1]);
            cur_gmProps['levels'][level_index] = event.target.value
        }
        else {
            cur_gmProps[property_name] = event.target.value;
        }
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
        // console.log(cur_gmProps[property_name], typeof(cur_gmProps[property_name]));
    },
    populateForm() {
        var gmProps = this.props.gmProps
        var form_contents = Object.keys(gmProps).map((key, index) => {
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
                                                onChange={this.handleChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='linear'
                                                id="bf-linear"
                                                onChange={this.handleChange}/>
                                        } linear

                                {
                                    log10_checked
                                        ?   <input type='radio'
                                                name='boxfill_type'
                                                value='log10'
                                                id="bf-log10"
                                                onChange={this.handleChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='log10'
                                                id="bf-log10"
                                                onChange={this.handleChange}/>
                                }  log10
                                {
                                    custom_checked
                                        ?   <input type='radio'
                                                name='boxfill_type'
                                                value='custom'
                                                id="bf-custom"
                                                onChange={this.handleChange}
                                                defaultChecked/>
                                        :  <input type='radio'
                                                name='boxfill_type'
                                                value='custom'
                                                id="bf-custom"
                                                onChange={this.handleChange}/>
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
                                    onChange={NOP}
									onBlur={this.handleChange} />
                            <h5>Color 2:</h5>

                                <input type="number"
                                    name="color_2"
                                    defaultValue={gmProps["color_2"]}
                                    onChange={NOP}
									onBlur={this.handleChange} />
                        </div>
                    );
                case 'colormap':
                    return (
                        <div key={'colormaps'+(Date.now()/Math.random())}>
                            <h5>Colormap: </h5>
                            <select name="colormap" defaultValue={gmProps[key]} onChange={this.handleChange}>
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
                                onChange={NOP}
								onBlur={this.handleChange}/>
                        </div>
                    );
                case 'datawc_timeunits':
                    return (
                        <div key={'datawc_timeunits'+(Date.now()/Math.random())}>
                            <h5>datawc_timeunits: </h5>
                            <input name='datawc_timeunits'
                                type='text'
                                defaultValue={gmProps[key]}
                                onChange={NOP}
								onBlur={this.handleChange}/>
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
                                        onChange={NOP}
                                        onBlur={this.handleChange}/> <br/>
                                    <h5>datawc_x2: </h5>
                                    <input type="text"
                                        name="datawc_x2"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_x2"]) && gmProps["datawc_x2"] > 1e4
                                            ? gmProps["datawc_x2"].toExponential()
                                            : gmProps["datawc_x2"]
                                        }
                                        onChange={NOP}
                                        onBlur={this.handleChange}/> <br/>

                                    <h5>datawc_y1: </h5>
                                    <input type="text"
                                        name="datawc_y1"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_y1"]) && gmProps["datawc_y1"] > 1e4
                                            ? gmProps["datawc_y1"].toExponential()
                                            : gmProps["datawc_y1"]
                                        }
                                        onChange={NOP}
                                        onBlur={this.handleChange}/> <br/>
                                    <h5>datawc_y2: </h5>
                                    <input type="text"
                                        name="datawc_y2"
                                        defaultValue={
                                            Number.isInteger(gmProps["datawc_y2"]) && gmProps["datawc_y2"] > 1e4
                                            ? gmProps["datawc_y2"].toExponential()
                                            : gmProps["datawc_y2"]
                                        }
                                        onChange={NOP}
                                        onBlur={this.handleChange}/> <br/>
                            </div>
                    );
                case 'ext_1':
                    var ext1 = gmProps['ext_1'];
                    var ext2 = gmProps['ext_2'];
                    var uniq_key = 'exts'+(Date.now()/Math.random())
                    return (
                        <div key={uniq_key}>
                            <h5>
                                Ext 1:
                            </h5>
                                {
                                    ext1
                                        ? <input type="checkbox"
                                            name="ext_1"
                                            onChange={this.handleChange}
                                            defaultChecked/>
                                        : <input type="checkbox"
                                            name="ext_1"
                                            onChange={this.handleChange}/>
                                }
                            <h5>
                                Ext 2:
                            </h5>
                                {
                                    ext2
                                        ? <input type="checkbox"
                                            name="ext_2"
                                            onChange={this.handleChange}
                                            defaultChecked/>
                                        : <input type="checkbox"
                                            name="ext_2"
                                            onChange={this.handleChange}/>
                                }
                        </div>
                    );
                case 'fillareacolors':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Fillareacolors: </h5>
                            <input type='text'
                                name={key}
                                defaultValue={gmProps[key]}
                                onChange={NOP}
                                onBlur={this.handleChange}/>
                        </div>
                    );
                case 'fillareaindices':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Fillareaindices: </h5>
                            <input type='text'
                                name={key}
                                defaultValue={gmProps[key]}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                        </div>
                    );
                case 'fillareaopacity':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Fillareaopacity: </h5>
                            <input type='text'
                                name={key}
                                defaultValue={gmProps[key]}
                                onChange={NOP}
                                onBlur={this.handleChange}/>
                        </div>
                    );
                case 'fillareastyle':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}
                            className={
                                gmProps['boxfill_type'] === 'custom'
                                ? ''
                                :'hide'}>
                            <h5>Fillareastyle: </h5>
                            <select name={key} defaultValue={gmProps[key]} onChange={this.handleChange}>
                                <option value='solid'>solid</option>
                                <option value='hatch'>hatch</option>
                                <option value='pattern'>pattern</option>
                            </select>
                        </div>
                    );
                case 'legend':
                    return(
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Legend: </h5>
                            <input type='text'
                                name={key}
                                defaultValue={gmProps[key]}
                                onChange={NOP}
                                onBlur={this.handleChange}/>
                        </div>
                    );
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
                                    onChange={NOP}
									onBlur={this.handleChange}/>
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
                                    onChange={NOP}
									onBlur={this.handleChange}/>

                        </div>
                    );
                case 'levels':
                    return (
                        <div key={'levels'+(Date.now()/Math.random())}>
                            <h5>Levels: </h5>
                            {
                                gmProps['levels'].length > 0
                                ? gmProps['levels'].map((value, index) => {
                                    return (
                                        <div key={'levels_'+index+(Date.now()/Math.random())}>
                                            <input name={'levels_'+index}
                                                type="text"
                                                defaultValue={
                                                    Number.isInteger(value) && value > 1e4
                                                    ? value.toExponential()
                                                    : value
                                                }
                                                onChange={NOP}
                                                onBlur={this.handleChange}/> <button onClick={this.removeLevel}
                                                        data-index={index}>
                                                        -
                                                    </button><br/>
                                            {
                                                index === (gmProps['levels'].length - 1)
                                                ? <button onClick={this.addLevel}> + </button>
                                                : ''
                                            }
                                        </div>
                                    );
                                 })
                                : <button onClick={this.addLevel}> + </button>

                            }
                        </div>
                    );
                case 'missing':
                    return (
                        <div key={key+index+(Date.now()/Math.random())}>
                            <h5>Missing: </h5>
                            <input type='number'
                                name='missing'
                                defaultValue={gmProps[key]}
                                onChange={NOP}
								onBlur={this.handleChange}/><br/>
                        </div>
                    );
                case 'projection':
                    return (
                        <div key={'projections'+(Date.now()/Math.random())}>
                            <h5>Projection: </h5>
                            <select name="projection" defaultValue={gmProps[key]} onChange={this.handleChange}>
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
                    let converts = ['linear', 'log10', 'ln', 'exp', 'area_wt']
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
                                                        onChange={that.handleChange}
                                                        defaultChecked/>
                                                    : <input name='xaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.handleChange}/>
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
                                                        onChange={that.handleChange}
                                                        defaultChecked/>
                                                    : <input name='yaxisconvert'
                                                        type='radio'
                                                        value={convert}
                                                        onChange={that.handleChange}/>
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
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>xmtics2: </h5>
                            <input name='xmtics2'
                                type='text'
                                defaultValue={gmProps['xmtics2']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>ymtics1: </h5>
                            <input name='ymtics1'
                                type='text'
                                defaultValue={gmProps['ymtics1']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>ymtics2: </h5>
                            <input name='ymtics2'
                                type='text'
                                defaultValue={gmProps['ymtics2']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                        </div>
                    );
                case "xticlabels1":
                    return (
                        <div key={'ticlabels'+Date.now()/Math.random()}>
                            <h5>xticlabels1: </h5>
                            <input name='xticlabels1'
                                type='text'
                                defaultValue={gmProps['xticlabels1']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>xticlabels2: </h5>
                            <input name='xticlabels2'
                                type='text'
                                defaultValue={gmProps['xticlabels2']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>yticlabels1: </h5>
                            <input name='yticlabels1'
                                type='text'
                                defaultValue={gmProps['yticlabels1']}
                                onChange={NOP}
								onBlur={this.handleChange}/>
                            <h5>yticlabels2: </h5>
                            <input name='yticlabels2'
                                type='text'
                                defaultValue={gmProps['yticlabels2']}
                                onBlur={this.handleChange}/>
                        </div>
                    );
                default:
                    return;
            }
        });
        return form_contents;
    },
    render() {
        return(
            <div>
                <div className='modal-body'>
                    {this.populateForm()}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button"
                        className="btn btn-primary"
                        id="commit-gm-edits"
                        onClick={this.commitEdits}>
                        Save changes
                    </button>
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
