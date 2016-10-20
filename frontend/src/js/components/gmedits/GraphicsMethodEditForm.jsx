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
    handleChange: function(event) {
        let property_name = event.target.name;
        let cur_gmProps = Object.assign({}, this.props.gmProps);
        if (event.target.type === 'checkbox') {
            cur_gmProps[property_name] = event.target.checked;
        } else if (property_name.match(/levels_[0-9]+/)) {
            let level_index = Number.parseInt(property_name.split('_')[1]);
            cur_gmProps['levels'][level_index] = event.target.value;
            console.log(cur_gmProps['levels'][level_index])
        } else {
            cur_gmProps[property_name] = event.target.value;
        }
        this.props.updateActiveGM(cur_gmProps, this.props.graphicsMethodParent, this.props.graphicsMethod);
        console.log(cur_gmProps[property_name], typeof(cur_gmProps[property_name]));
    },
    commitEdits() {

    },
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
    },
    render() {
        return(
            <div>
                <div className='modal-body'>
                    <div className="container-fluid">
                        <div className='col-md-12'>
                            <h4>Boxfill Settings:</h4>
                            <BoxfillType handleChange={this.handleChange}
                                type={this.props.gmProps['boxfill_type']}
                                headerClass='col-md-3'
                                radioClass='col-md-3'/>
                            <div className='row'>
                                <Missing handleChange={this.handleChange}
                                    missing={this.props.gmProps['missing']}
                                    className='col-md-6'/>
                                <Exts handleChange={this.handleChange}
                                    ext1={this.props.gmProps['ext_1']}
                                    ext2={this.props.gmProps['ext_2']}
                                    className='col-md-3'/>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <h5>Legend Labels: </h5>
                                    <input type='text'
                                        name='legend'
                                        defaultValue={this.props.gmProps['legend']}
                                        onChange={NOP}
                                        onBlur={this.handleChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
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
