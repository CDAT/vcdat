import React from 'react'
import GMEditForm from '../GMEditForm.jsx'

var GraphicsMethodEditor = React.createClass({
    propTypes: {
        boxfill: React.PropTypes.object,
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string
    },
    props: {
        gm_settings:{
            "boxfill": {
                "type": {
                    "defaults": ["linear", "log10", "custom"],
                    "data-type": "Number"
                },
                "color_1": 16,
                "color_2": 239,
                "colormap": null,
                "datawc_calendar": 135441,
                "datawc_timeunits": "days since 2000",
                "datawc_x1": 1e+20,
                "datawc_x2": 1e+20,
                "datawc_y1": 1e+20,
                "datawc_y2": 1e+20,
                "ext_1": false,
                "ext_2": false,
                "fillareacolors": null,
                "fillareaindices": [1],
                "fillareaopacity": [],
                "fillareastyle": ["solid", "hatch", "pattern"],
                "legend": null,
                "level_1": 1e+20,
                "level_2": 1e+20,
                "levels": [1e+20, 1e+20],
                "missing": 1,
                "projection": "linear",
                "xaxisconvert": "linear",
                "xmtics1": "",
                "xmtics2": "",
                "xticlabels1": "*",
                "xticlabels2": "*",
                "yaxisconvert": "linear",
                "ymtics1": "",
                "ymtics2": "",
                "yticlabels1": "*",
                "yticlabels2": "*"
            }
        }
    },
    render() {
        return (
            <div className="modal fade" id='graphics-method-editor'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">
                                {'Editing    ' + this.props.graphicsMethod + '    ' + this.props.graphicsMethodParent}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <GMEditForm
                                graphicsMethod={this.props.graphicsMethod}
                                graphicsMethodParent={this.props.graphicsMethodParent}
                            />
                            <button className='btn btn-default'>Left Ticks</button>
                            <button className='btn btn-default'>Right Ticks</button>
                            <button className='btn btn-default'>Bottom Ticks</button>
                            <button className='btn btn-default'>Top Ticks</button>
                            <button className='btn btn-default'>Projection</button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default GraphicsMethodEditor;
