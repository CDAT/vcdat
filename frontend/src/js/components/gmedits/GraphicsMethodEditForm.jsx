import React from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions/Actions.js'
import $ from 'jquery'
import ColormapField from './ColormapField.jsx'
import BoxfillType from './BoxfillType.jsx'
import ColorOneTwo from './ColorOneTwo.jsx'
import DatawcCoordinates from './DatawcCoordinates.jsx'
import Exts from './Exts.jsx'
import TicsAndLabels from './TicsAndLabels.jsx'
import AxisTransforms from './AxisTransforms.jsx'
import Levels from './Levels.jsx'
import FillareaFields from './FillareaFields.jsx'
import LevelOneTwo from './LevelOneTwo.jsx'
import Missing from './Missing.jsx'
import Projection from './Projection.jsx'
import Legend from './Legend.jsx'

var GraphicsMethodEditForm = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object,
        plotActiveGM: React.PropTypes.func,
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
        cur_gmProps['levels'] = cur_gmProps['levels'].concat(1e+20);
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
    handleChange: function(event) {
        let property_name = event.target.name;
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        if (event.target.type === 'checkbox') {
            cur_gmProps[property_name] = event.target.checked;
        } else if (property_name.match(/levels_[0-9]+/)) {
            let level_index = Number.parseInt(property_name.split('_')[1]);
            cur_gmProps['levels'][level_index] = event.target.value;
            console.log(cur_gmProps['levels'][level_index], typeof(cur_gmProps['levels'][level_index]))
        } else {
            cur_gmProps[property_name] = event.target.value;
        }
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
        console.log(cur_gmProps[property_name], typeof(cur_gmProps[property_name]));
    },
    changeState(property_name, value, index=null) {
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        if(!index) {
            cur_gmProps[property_name] = value;
        } else {
            console.log(index)
            cur_gmProps[property_name][index] = value;
        }
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
        console.log(cur_gmProps[property_name], typeof(cur_gmProps[property_name]));
    },
    commitEdits() {
        this.props.plotActiveGM(this.props.gmProps);
    },
    render() {
        return(
            <div>
                <div className='modal-body'>
                    <div className="container-fluid">
                        <div className='col-md-12'>
                            <h4>Boxfill Settings</h4>
                            <BoxfillType handleChange={this.handleChange}
                                type={this.props.gmProps['boxfill_type']}
                                headerClass='col-md-4'
                                radioClass='col-md-4'/>
                            <div className='row'>
                                <Missing handleChange={this.changeState}
                                    missing={this.props.gmProps['missing']}
                                    className='col-md-6'/>
                                <Exts handleChange={this.handleChange}
                                    ext1={this.props.gmProps['ext_1']}
                                    ext2={this.props.gmProps['ext_2']}
                                    className='col-md-3'/>
                            </div>
                            <div className='row'>
                                <Legend handleChange={this.handleChange}
                                    legend={this.props.gmProps['legend']}
                                    className='col-md-12'/>
                            </div>
                        </div>
                        <div className={
                            this.props.gmProps['boxfill_type'] !== 'custom'
                            ? 'col-md-12'
                            : 'hide'}>
                            <h4>Linear and Log Settings</h4>
                            <div className="col-md-6">
                                <LevelOneTwo handleChange={this.changeState}
                                    level1={this.props.gmProps['level_1']}
                                    level2={this.props.gmProps['level_2']} />
                            </div>
                            <div className="col-md-6">
                                <ColorOneTwo handleChange={this.changeState}
                                    color1={this.props.gmProps['color_1']}
                                    color2={this.props.gmProps['color_2']} />
                            </div>
                        </div>
                        <div className={
                            this.props.gmProps['boxfill_type'] === 'custom'
                            ? 'col-md-12'
                            : 'hide'}>
                            <h4>Custom Settings</h4>
                            <Levels handleChange={this.changeState}
                                levels={this.props.gmProps['levels']}
                                addLevel={this.addLevel}
                                removeLevel={this.removeLevel} />
                            <FillareaFields handleChange={this.handleChange}
                                colors={this.props.gmProps['fillareacolors']}
                                style={this.props.gmProps['fillareastyle']}
                                indices={this.props.gmProps['fillareaindices']}
                                opacity={this.props.gmProps['fillareaopacity']} />
                        </div>
                    </div>
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
        updateActiveGM: (gmProps, gmParent, gm) => dispatch(Actions.updateActiveGM(gmProps, gmParent, gm)),
        plotActiveGM: (gmProps) => dispatch(Actions.plotActiveGM(gmProps))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphicsMethodEditForm);

/* in case I need it later. Don't judge me.
populateForm() {
        var gmProps = this.props.gmProps
        var form_contents = Object.keys(gmProps).map((key, index) => {
            switch(key) {
                case 'boxfill_type':
                    return (
                        <BoxfillType key={key+index+(Date.now()/Math.random())}
                            handleChange={this.handleChange}
                            type={gmProps[key]} />
                    );
                case 'color_1':
                    return (
                         <ColorOneTwo key={'colors'+index+(Date.now()/Math.random())}
                             handleChange={this.handleChange}
                             colorOne={gmProps['color_1']}
                             colorTwo={gmProps['color_2']}/>
                    );
                case 'colormap':
                    return (
                        <ColormapField key={'colormaps'+(Date.now()/Math.random())}
                            defaultValue={this.props.gmProps[key]}
                            handleChange={this.handleChange}/>
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
                        <DatawcCoordinates key={"worldcoordinates"+index+(Date.now()/Math.random())}
                            handleChange={this.handleChange}
                            x1={gmProps['datawc_x1']}
                            x2={gmProps['datawc_x2']}
                            y1={gmProps['datawc_y1']}
                            y2={gmProps['datawc_y2']}/>
                    );
                case 'ext_1':
                    var ext1 = gmProps['ext_1'];
                    var ext2 = gmProps['ext_2'];
                    return (
                        <Exts key={'exts'+(Date.now()/Math.random())}
                            handleChange={this.handleChange}
                            ext1={ext1}
                            ext2={ext2}/>
                    );
                case 'fillareacolors':
                    return (
                        <FillareaFields key={'fillarea-fields'+(Date.now()/Math.random())}
                            className={
                                gmProps['boxfill_type'] === 'custom'
                                    ? ''
                                    :'hide'}
                            colors={gmProps['fillareacolors']}
                            indices={gmProps['fillareaindices']}
                            opacity={gmProps['fillareaopacity']}
                            style={gmProps['fillareastyle']}
                            handleChange={this.handleChange}/>

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
                        <LevelOneTwo key={"level-1-2"+index+(Date.now()/Math.random())}
                            handleChange={this.handleChange}
                            level1={gmProps['level_1']}
                            level2={gmProps['level_2']}/>
                    );
                case 'levels':
                    return (
                        <Levels key={'levels'+(Date.now()/Math.random())}
                            levels={gmProps['levels']}
                            addLevel={this.addLevel}
                            removeLevel={this.removeLevel}
                            handleChange={this.handleChange}/>
                    );
                case 'missing':
                    return (
                        <Missing key={key+index+(Date.now()/Math.random())}
                            handleChange={this.handleChange}
                            missing={gmProps['missing']}/>
                    );
                case 'projection':
                    return (
                        <Projection key={'projection-selector'+(Date.now()/Math.random())}
                            projection={gmProps['projection']}
                            handleChange={this.handleChange} />
                    );
                case 'xaxisconvert':
                    return (
                        <AxisTransforms key={'axis-transforms'+Date.now()/Math.random()}
                            handleChange={this.handleChange}
                            converts={['linear', 'log10', 'ln', 'exp', 'area_wt']}
                            defaultX={gmProps['xaxisconvert']}
                            defaultY={gmProps['yaxisconvert']} />
                    );
                case 'xmtics1':
                    return (
                        <TicsAndLabels key={'tics-and-labels'+Date.now()/Math.random()}
                            handleChange={this.handleChange}
                            xmt1={gmProps['xmtics1']}
                            xmt2={gmProps['xmtics2']}
                            ymt1={gmProps['ymtics1']}
                            ymt2={gmProps['ymtics2']}
                            xtl1={gmProps['xticlabels1']}
                            xtl2={gmProps['xticlabels2']}
                            ytl1={gmProps['yticlabels1']}
                            ytl2={gmProps['yticlabels2']} />
                    );
                default:
                    return;
            }
        });
        return form_contents;
    }, */
