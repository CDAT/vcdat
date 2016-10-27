import React from 'react'
import GraphicsMethodEditForm from '../gmedits/GraphicsMethodEditForm.jsx'

var GraphicsMethodEditor = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object
    },
    render() {
        let default_GM_props = {
            no_gm_selected: true
        }
        let gm_props = this.props.gmProps ?this.props.gmProps :default_GM_props;
        let gm_name = this.props.graphicsMethod ?this.props.graphicsMethod :"Graphics Method Edit Menu";
        let parent_name = this.props.graphicsMethodParent ?this.props.graphicsMethodParent :"";
        return (
            <div className="modal fade" id='graphics-method-editor'>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">
                                {gm_name+'\t'+parent_name}
                            </h4>
                        </div>
                        <GraphicsMethodEditForm
                            graphicsMethod={this.props.graphicsMethod}
                            graphicsMethodParent={this.props.graphicsMethodParent}
                            gmProps={gm_props}
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
