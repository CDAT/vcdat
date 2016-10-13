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
                                {'Editing    ' + this.props.graphicsMethod + '    ' + this.props.graphicsMethodParent}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <GraphicsMethodEditForm
                                graphicsMethod={this.props.graphicsMethod}
                                graphicsMethodParent={this.props.graphicsMethodParent}
                                gmProps={this.props.gmProps}
                            />
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
