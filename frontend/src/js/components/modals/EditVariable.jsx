import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button, Row, Col, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import { DropTarget, DragSource } from 'react-dnd'
import { findDOMNode } from 'react-dom'

import DimensionSlider from './CachedFiles/DimensionSlider/DimensionSlider.jsx'
import DragAndDropTypes from '../../constants/DragAndDropTypes.js'
import Actions from '../../constants/Actions.js'
import $ from 'jquery'

class EditVariable extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            variablesAxes: null,
            selectedVariable: null,
            dimension: null,
        }
        this.getVariableInfo()
    }

    getVariableInfo(){
        return new Promise((resolve, reject) => {
            try{
                resolve(
                    vcs.variables(this.props.variables[this.props.active_variable].path).then((variablesAxes) => {
                        let selectedVariable, dimension;
                        if (variablesAxes[0][this.props.active_variable]) {
                            // it's a variablevar 
                            selectedVariable = variablesAxes[0][this.props.active_variable];
                            dimension = $.extend(true, [], this.props.variables[this.props.active_variable].dimension)
                        }
                        else {
                            // it's a axis
                            selectedVariable = variablesAxes[1][this.props.active_variable];
                            dimension = { axisName: this.props.active_variable };
                        }
                        this.setState({
                            selectedVariable,
                            variablesAxes,
                            dimension,
                        });
                    })
                )
            }
            catch(e){
                console.warn(e)
                reject(e)
            }
        })
    }

    handleDimensionValueChange(values, axisName = undefined) {
        if (axisName) {
            let new_dimension = this.state.dimension.slice()
            new_dimension.find(dimension => dimension.axisName === axisName).values = values;
            this.setState({dimension: new_dimension})
        }
        else {
            let new_dimension = this.state.dimension
            new_dimension.values = values;
            this.setState({dimension: new_dimension})
        }
    }

    save(){
        this.props.updateVariable(this.props.active_variable, this.state.dimension)
        this.props.onTryClose()
    }

    render() {
        let slider_values = {}
        for(let dimension of this.props.variables[this.props.active_variable].dimension){
            if(dimension.values){
                slider_values[dimension.axisName] = {
                    range: dimension.values.range,
                    stride: dimension.stride
                }
            }
            else{
                slider_values[dimension.axisName] = {
                    range: [undefined, undefined],
                    stride: undefined
                }
            }
        }
        return (
            <Modal show={this.props.show} bsSize="large" onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Variable</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.selectedVariable &&
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
                                        <DimensionDnDContainer 
                                            key={axisName}
                                            low_value={slider_values[axisName].range[0]}
                                            high_value={slider_values[axisName].range[1]}
                                            index={i}
                                            axis={axis}
                                            axisName={axisName}
                                            handleDimensionValueChange={(values) => this.handleDimensionValueChange(values, axisName)}
                                            moveDimension={(dragIndex, hoverIndex) => this.moveDimension(dragIndex, hoverIndex)} />
                                    )
                                })
                            }
                            {/* if is an Axis */}
                            {!this.state.selectedVariable.axisList &&
                                <Row key={this.state.selectedVariable.name} className="dimension">
                                    <Col sm={2} className="text-right"><span>{this.state.selectedVariable.name}</span></Col>
                                    <Col sm={8} className="right-content">
                                        <DimensionSlider {...this.state.selectedVariable} onChange={(values) => this.handleDimensionValueChange(values)} />
                                    </Col>
                                </Row>
                            }
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button id="edit-var-save" bsStyle="default" bsSize="small" onClick={() => this.save()}>Save</Button>
                    <Button id="edit-var-close" bsStyle="default" bsSize="small" onClick={() => this.props.onTryClose()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
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
    updateVariable: PropTypes.func,
}

var DimensionContainer = (props) => {
    const opacity = props.isDragging ? 0 : 1;
    return props.connectDropTarget(props.connectDragPreview(<div className="row dimension" style={{ opacity }}>
        <Col sm={2} className="text-right"><span>{props.axis.name}</span></Col>
        {props.connectDragSource(<div className="sort col-sm-1"><Glyphicon glyph="menu-hamburger" /></div>)}
        <div className="col-sm-7 right-content">
            <DimensionSlider {...props.axis} onChange={props.handleDimensionValueChange} low_value={props.low_value} high_value={props.high_value} />
        </div>
    </div>));
}

var DimensionDnDContainer = _.flow(
    DragSource(DragAndDropTypes.DIMENSION,
        {
            beginDrag: (props) => {
                return {
                    id: props.id,
                    index: props.index
                }
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
                if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
                    || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
                    return;
                }
                props.moveDimension(dragIndex, hoverIndex);
                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                monitor.getItem().index = hoverIndex;
            },
        },
        (connect, monitor) => {
            return {
                connectDropTarget: connect.dropTarget(),
                isOver: monitor.isOver(),
            };
        }
    ))(DimensionContainer);

const mapDispatchToProps = (dispatch) => {
    return {
        updateVariable: (name, dimensions) => {
            dispatch(Actions.updateVariable(name, dimensions))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        variables: state.present.variables,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVariable);
export {EditVariable as PureEditVariable}