import React from 'react'
import widgets from 'vcs-widgets'
import $ from 'jquery'
import {Modal, ButtonToolbar, Button} from 'react-bootstrap';

var GraphicsMethodEditor = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.object,
        colormaps: React.PropTypes.object,
        updateGraphicsMethod: React.PropTypes.func,
        show: React.PropTypes.bool,
        onHide: React.PropTypes.func
    },
    getInitialState() {
        return {
            workingGraphicsMethod: $.extend({}, this.props.graphicsMethod)
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            workingGraphicsMethod: $.extend({}, nextProps.graphicsMethod)
        });
    },
    updateGraphicsMethod(attr, value) {
        const p = $.extend({}, this.state.workingGraphicsMethod);
        p[attr] = value;
        this.setState({"workingGraphicsMethod": p})
    },
    render() {
        var GMForm = widgets.GMEdit;
        const self = this;
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.graphicsMethod.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GMForm colormaps={this.props.colormaps}
                            graphicsMethod={this.state.workingGraphicsMethod}
                            updateGraphicsMethod={this.updateGraphicsMethod} />
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button onClick={this.props.onHide}>Cancel</Button>
                        <Button onClick={() => {self.props.updateGraphicsMethod(self.state.workingGraphicsMethod); self.props.onHide();}}>Save</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
})

export default GraphicsMethodEditor;
