import React from 'react'
import GraphicsMethodEditForm from '../gmedits/GraphicsMethodEditForm.jsx'

var GraphicsMethodEditor = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object
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
                                {this.props.graphicsMethod} &emsp; {this.props.graphicsMethodParent}
                            </h4>
                        </div>
                        <GraphicsMethodEditForm
                            graphicsMethod={this.props.graphicsMethod}
                            graphicsMethodParent={this.props.graphicsMethodParent}
                            gmProps={this.props.gmProps}
                            updateGraphicsMethods={this.props.updateGraphicsMethods}
                            updateActiveGM={this.props.updateActiveGM}
                            graphicsMethods={this.props.graphicsMethods}/>
                    </div>
                </div>
            </div>
        )
    }
})

export default GraphicsMethodEditor;
