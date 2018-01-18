import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal, Button, Row, Col, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import { DropTarget, DragSource } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import DimensionSlider from './CachedFiles/DimensionSlider/DimensionSlider.jsx';
import DragAndDropTypes from '../../constants/DragAndDropTypes.js';

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
                            dimension = selectedVariable.axisList.map((axisName) => {
                                return { axisName };
                            })
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
                console.log(e)
                reject(e)
            }
        })
    }

    handleDimensionValueChange(values, axisName = undefined) {
        if (axisName) {
            this.state.dimension.find(dimension => dimension.axisName === axisName).values = values;
        }
        else {
            this.state.dimension.values = values;
        }
    }

    save(){
        console.log("save here")
    }

    render() {
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
                                        <DimensionDnDContainer key={axisName}  index={i} axis={axis} axisName={axisName} handleDimensionValueChange={(values) => this.handleDimensionValueChange(values, axisName)} moveDimension={(dragIndex, hoverIndex) => this.moveDimension(dragIndex, hoverIndex)} />
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
                    <Button bsStyle="default" bsSize="small" onClick={() => this.save()}>Save</Button>
                    <Button bsStyle="default" bsSize="small" onClick={() => this.props.onTryClose()}>Close</Button>
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
    show: React.PropTypes.bool, 
    onTryClose: React.PropTypes.func.isRequired,
    variables: React.PropTypes.object,
    active_variable: React.PropTypes.string,
}

var DimensionContainer = (props) => {
    const opacity = props.isDragging ? 0 : 1;
    return props.connectDropTarget(props.connectDragPreview(<div className="row dimension" style={{ opacity }}>
        <Col sm={2} className="text-right"><span>{props.axis.name}</span></Col>
        {props.connectDragSource(<div className="sort col-sm-1"><Glyphicon glyph="menu-hamburger" /></div>)}
        <div className="col-sm-7 right-content">
            <DimensionSlider {...props.axis} onChange={props.handleDimensionValueChange} />
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

const mapStateToProps = (state) => {
    return {
        variables: state.present.variables,
    }
}

export default connect(mapStateToProps, null)(EditVariable);