import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Button, Row, Col, Glyphicon } from "react-bootstrap";
import _ from "lodash";
import { DropTarget, DragSource } from "react-dnd";
import { findDOMNode } from "react-dom";

import DimensionSlider from "./CachedFiles/DimensionSlider/DimensionSlider.jsx";
import AxisTransform from "./CachedFiles/AxisTransform.jsx";
import DragAndDropTypes from "../../constants/DragAndDropTypes.js";
import Actions from "../../constants/Actions.js";
import $ from "jquery";

class EditVariable extends Component {
    constructor(props) {
        super(props);

        let transforms = {};
        try {
            transforms = $.extend(true, {}, this.props.variables[this.props.active_variable].transforms);
        } catch (e) {
            transforms = {};
        }
        this.state = {
            variablesAxes: null,
            selectedVariable: null,
            dimension: null,
            axis_transforms: transforms || {}
        };
        this.getVariableInfo();
        this.handleAxisTransform = this.handleAxisTransform.bind(this);
    }

    getVariableInfo() {
        let spec = this.props.variables[this.props.active_variable].path;
        if (this.props.variables[this.props.active_variable].json) {
            spec = {
                json: this.props.variables[this.props.active_variable].json
            };
        }
        try {
            return vcs.variable(spec).then(variablesAxes => {
                let selectedVariable, dimension;
                debugger;
                // if (variablesAxes[0]) {
                // it's a variablevar
                selectedVariable = variablesAxes[0];
                dimension = $.extend(true, [], this.props.variables[this.props.active_variable].dimension);
                if (this.props.variables[this.props.active_variable].json) {
                    selectedVariable.json = this.props.variables[this.props.active_variable].json;
                }
                // } else {
                //     // it's an axis
                //     selectedVariable = variablesAxes[1][this.props.active_variable];
                //     dimension = { axisName: this.props.active_variable };
                // }
                this.setState({
                    selectedVariable,
                    variablesAxes,
                    dimension
                });
            });
        } catch (e) {
            console.warn(e);
        }
    }

    handleDimensionValueChange(values, axisName = undefined) {
        if (axisName) {
            let new_dimension = this.state.dimension.slice();
            new_dimension.find(dimension => dimension.axisName === axisName).values = values;
            this.setState({ dimension: new_dimension });
        } else {
            let new_dimension = this.state.dimension;
            new_dimension.values = values;
            this.setState({ dimension: new_dimension });
        }
    }

    handleAxisTransform(axis_name, transform) {
        let new_transforms = _.cloneDeep(this.state.axis_transforms);
        new_transforms[axis_name] = transform;
        this.setState({
            axis_transforms: new_transforms
        });
    }

    save() {
        this.props.updateVariable(this.props.active_variable, this.state.dimension, this.state.axis_transforms);
        this.props.onTryClose();
    }

    render() {
        let slider_values = {};
        for (let dimension of this.props.variables[this.props.active_variable].dimension) {
            if (dimension.values) {
                slider_values[dimension.axisName] = {
                    range: dimension.values.range,
                    stride: dimension.stride
                };
            } else {
                slider_values[dimension.axisName] = {
                    range: [undefined, undefined],
                    stride: undefined
                };
            }
        }
        return (
            <Modal show={this.props.show} bsSize="large" onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.selectedVariable && (
                        <div className="dimensions">
                            <Row>
                                <Col className="text-right" sm={2}>
                                    <h4>Dimensions</h4>
                                </Col>
                            </Row>
                            {/* If is a variable */}
                            {this.state.dimension &&
                                this.state.dimension.map(dimension => dimension.axisName).map((axisName, i) => {
                                    let axis = this.state.variablesAxes[1][axisName];
                                    return (
                                        <div key={axisName} className="axis">
                                            <DimensionDnDContainer
                                                key={axisName}
                                                low_value={slider_values[axisName].range[0]}
                                                high_value={slider_values[axisName].range[1]}
                                                index={i}
                                                axis={axis}
                                                axisName={axisName}
                                                handleDimensionValueChange={values => this.handleDimensionValueChange(values, axisName)}
                                                moveDimension={(dragIndex, hoverIndex) => this.moveDimension(dragIndex, hoverIndex)}
                                                axis_transform={this.state.axis_transforms[axisName] || "def"}
                                                handleAxisTransform={this.handleAxisTransform}
                                            />
                                        </div>
                                    );
                                })}
                            {/* if is an Axis */}
                            {!this.state.selectedVariable.axisList && (
                                <div key={this.state.selectedVariable.name} className="dimension">
                                    <div className="text-right">
                                        <span>{this.state.selectedVariable.name}</span>
                                    </div>
                                    <div className="right-content">
                                        <DimensionSlider
                                            {...this.state.selectedVariable}
                                            onChange={values => this.handleDimensionValueChange(values)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button id="edit-var-save" bsStyle="primary" onClick={() => this.save()}>
                        Save
                    </Button>
                    <Button id="edit-var-close" bsStyle="default" onClick={() => this.props.onTryClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    moveDimension(dragIndex, hoverIndex) {
        var dimensions = this.state.dimension.slice();
        dimensions.splice(hoverIndex, 0, dimensions.splice(dragIndex, 1)[0]);
        this.setState({ dimension: dimensions });
    }
}
EditVariable.propTypes = {
    show: PropTypes.bool,
    onTryClose: PropTypes.func.isRequired,
    variables: PropTypes.object,
    active_variable: PropTypes.string,
    updateVariable: PropTypes.func
};

var DimensionContainer = props => {
    const opacity = props.isDragging ? 0 : 1;
    return props.connectDropTarget(
        props.connectDragPreview(
            <div className="dimension" style={{ opacity }}>
                <div className="axis-name text-right">
                    <span>{props.axis.name}</span>
                </div>
                {props.connectDragSource(
                    <div className="sort">
                        <Glyphicon glyph="menu-hamburger" />
                    </div>
                )}
                <div className="right-content">
                    <DimensionSlider {...props.axis} onChange={props.handleDimensionValueChange} />
                </div>
                <AxisTransform axis_name={props.axis.name} axis_transform={props.axis_transform} handleAxisTransform={props.handleAxisTransform} />
            </div>
        )
    );
};

var DimensionDnDContainer = _.flow(
    DragSource(
        DragAndDropTypes.DIMENSION,
        {
            beginDrag: props => {
                return {
                    id: props.id,
                    index: props.index
                };
            }
        },
        (connect, monitor) => {
            return {
                connectDragSource: connect.dragSource(),
                connectDragPreview: connect.dragPreview(),
                isDragging: monitor.isDragging()
            };
        }
    ),
    DropTarget(
        DragAndDropTypes.DIMENSION,
        {
            // by example of react-dnd https://github.com/react-dnd/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js#L25
            hover(props, monitor, component) {
                const dragIndex = monitor.getItem().index;
                const hoverIndex = props.index;
                if (dragIndex === hoverIndex) {
                    return;
                }
                const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset();
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY) || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
                    return;
                }
                props.moveDimension(dragIndex, hoverIndex);
                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                monitor.getItem().index = hoverIndex;
            }
        },
        (connect, monitor) => {
            return {
                connectDropTarget: connect.dropTarget(),
                isOver: monitor.isOver()
            };
        }
    )
)(DimensionContainer);

const mapDispatchToProps = dispatch => {
    return {
        updateVariable: (name, dimensions, transforms) => {
            dispatch(Actions.updateVariable(name, dimensions, transforms));
        }
    };
};

const mapStateToProps = state => {
    return {
        variables: state.present.variables
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditVariable);
export { EditVariable as PureEditVariable };
