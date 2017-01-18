import React from 'react'
import widgets from 'vcs-widgets'
import $ from 'jquery'

var GraphicsMethodEditor = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.object,
        colormaps: React.PropTypes.object,
        updateGraphicsMethod: React.PropTypes.func,
    },
    componentDidMount() {
        $("#graphics-method-editor").modal();
    },
    render() {
        var GMForm = widgets.GMEdit;
        return (
            <div className="modal fade" id='graphics-method-editor'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">
                                {this.props.graphicsMethod.name}
                            </h4>
                        </div>
                        <GMForm colormaps={this.props.colormaps}
                            graphicsMethod={this.props.graphicsMethod}
                            updateGraphicsMethod={this.props.updateGraphicsMethod} />
                    </div>
                </div>
            </div>
        )
    }
})

export default GraphicsMethodEditor;
