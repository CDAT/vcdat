import React from 'react'

var GraphicsMethodEditor = React.createClass({
    render() {
        return (
            <div className="modal fade" id='graphcis-method-editor'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">
                                {'Editing ' + this.props.graphicsMethodParent + ' ' + this.props.graphicsMethod}
                            </h4>
                        </div>
                        <div className="modal-body">
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
