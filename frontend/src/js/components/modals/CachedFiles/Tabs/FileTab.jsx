import React, { Component } from 'react'
import { Button, Row, Col, Glyphicon, FormControl, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import { DropTarget, DragSource } from 'react-dnd';
import DragAndDropTypes from 'constants/DragAndDropTypes';
import { findDOMNode } from 'react-dom';
import { cleanPath } from '../CachedFiles.jsx'
import DimensionSlider from './DimensionSlider/DimensionSlider.jsx';


const HISTORY_KEY = "variable_history_files"
const BOOKMARK_KEY = "variable_bookmark_files"

class FileTab extends Component{
    constructor(props){
        super(props)
        let history_files;
        let bookmark_files;
        try {
             history_files = JSON.parse(localStorage.getItem(HISTORY_KEY))
             if (!Array.isArray(history_files)){
                history_files = []
            }
        }
        catch(e){
            history_files = []
        }
        try{
            bookmark_files = JSON.parse(localStorage.getItem(BOOKMARK_KEY))
            if (!Array.isArray(bookmark_files)){
                bookmark_files = []   
            }
        }
        catch(e){
            bookmark_files = []
        }
        this.state ={
            showFileExplorer: false,
            selectedFile: '',
            historyFiles: history_files,
            bookmarkFiles: bookmark_files,
            showBookmarkZone: false,
            variablesAxes: null,
            selectedVariable: null,
            selectedVariableName: '',
            redefinedVariableName: '',
            temporaryRedefinedVariableName: '',
            dimension: null,
        }
    }

    handleFileExplorerTryClose() {
        this.setState({ showFileExplorer: false });
    }

    handleFileSelected(file) {
        this.handleFileExplorerTryClose();
        var path = cleanPath(file.path + '/' + file.name);

        vcs.variables(path).then((variablesAxes) => {
            console.log(variablesAxes);
            var historyFiles = [file, ...this.state.historyFiles.filter(historyFile => {
                return historyFile.path !== file.path || historyFile.name !== file.name;
            })];
            localStorage.setItem(HISTORY_KEY, JSON.stringify(historyFiles))
            this.setState({
                variablesAxes,
                selectedFile: file,
                historyFiles: historyFiles,
                selectedVariableName: Object.keys(variablesAxes[0])[0],
                selectedVariable: null
            });
        });
    }

    handleDimensionValueChange(values, axisName = undefined) {
        if (axisName) {
            this.state.dimension.find(dimension => dimension.axisName === axisName).values = values;
        }
        else {
            this.state.dimension.values = values;
        }
    }

    handleDragStart(event, file){
        let data = _.assign({}, file)
        event.dataTransfer.setData('text', JSON.stringify(data)); // datatype must be text/plain due to chrome bug
        
        this.setState({showBookmarkZone: true})
    }

    handleDragOver(event){
        event.preventDefault()
        event.stopPropagation() // Stupid drag and drop api issue
    }

    handleDrop(event){
        try {
            let file = JSON.parse(event.dataTransfer.getData('text'));
            let bookmarks = this.state.bookmarkFiles.slice()
            bookmarks.push(file)
            localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks))
            this.setState({bookmarkFiles: bookmarks})
        } catch (e) {
            console.log(e)
            return;
        }
    }

    handleDragEnd(){
        this.setState({showBookmarkZone: false})
    }

    _formatVariables(variables) {
        return Object.keys(variables).map((variableName) => {
            // let variable = variables[variableName];
            // let label = `${variableName} (${variable.shape.join(',')}) ${variable.name}`
            var vars = variables;
            var v = variableName;
            var shape = ' (' + vars[v].shape[0];
            for (let i = 1; i < vars[v].shape.length; ++i) {
                shape += (',' + vars[v].shape[i]);
            }
            shape += ')';
            // axes for the variable
            var al = vars[v].axisList;
            var axisList = '(' + al[0];
            for (let i = 1; i < al.length; ++i) {
                axisList += (', ' + al[i]);
            }
            axisList += ')';
            // bounds are received for longitude and latitude
            var boundsString = '';
            if (vars[v].bounds) {
                boundsString += ': (' + vars[v].bounds[0] + ', ' +
                    vars[v].bounds[1] + ')';
            }
            // longitude, latitude for the variable
            // these are different than the axes for the curvilinear or
            // generic grids
            var lonLat = null;
            if (vars[v].lonLat) {
                lonLat = '(' + vars[v].lonLat[0] + ', ' +
                    vars[v].lonLat[1] + ')';
            }
            var label = v + shape + ' [' + vars[v].name + ', ' +
                vars[v].units + boundsString + '] ' + ': ' + axisList;
            if (lonLat) {
                label += (', ' + lonLat);
            }
            if (vars[v].gridType) {
                label += (', ' + vars[v].gridType);
            }

            return <option key={v} value={v}>{label}</option>;
        })
    }

    _formatAxes(axes) {
        return Object.keys(axes).map((axisName) => {
            var v = axisName;
            var shape = '(' + axes[v].shape[0];
            for (let i = 1; i < axes[v].shape.length; ++i) {
                shape += (',' + axes[v].shape[i]);
            }
            shape += ')';
            var label = v + shape + '[' + axes[v].name + ', ' +
                axes[v].units + ': (' +
                axes[v].data[0] + ', ' +
                axes[v].data[axes[v].data.length - 1] + ')]';
            return <option key={axisName} value={axisName}>{label}</option>;
        });
    }

    moveDimension(dragIndex, hoverIndex) {
        var dimensions = this.state.dimension.slice();
        dimensions.splice(hoverIndex, 0, dimensions.splice(dragIndex, 1)[0]);
        this.setState({ dimension: dimensions });
    }

    render(){
        return(
            <div>
                <div className="load-from">
                    <Row>
                        <Col className="text-right" sm={2}>
                            <h4>Load From</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right" sm={2}>
                            File
                        </Col>
                        <Col sm={9}>
                            <InputGroup bsSize="small">
                                <FormControl className="full-width file-path" type="text" value={this.selectedFilePath} />
                                <InputGroup.Button>
                                    <Button bsStyle="primary" onClick={
                                        () => this.setState({ showFileExplorer: true })}><Glyphicon glyph="file" /></Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right" sm={2}>
                            Variable(s)
                        </Col>
                        <Col sm={9}>
                            <FormControl
                                className="input-sm full-width"
                                componentClass="select"
                                onChange={(e) => this.setState({ selectedVariableName: e.target.value })}
                                value={this.state.selectedVariableName}>
                                {this._formatvariablesAxes()}
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right" sm={2}>
                            History:
                        </Col>
                        <Col sm={9}>
                            <FormControl className="history" componentClass="div">
                                {this.state.historyFiles.map((file, i) => {
                                    return (
                                        <div 
                                            className="file"
                                            key={i}
                                            draggable="true"
                                            onDragStart={(e) => {this.handleDragStart(e, file)}}
                                            onDragEnd={(e) => {this.handleDragEnd(e)}}
                                            onClick={(e) => this.handleFileSelected(file)}>
                                            {cleanPath(file.path + '/' + file.name)}
                                        </div>
                                    )
                                })}
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right" sm={2}>
                            Bookmarks:
                        </Col>
                        <Col sm={9}>
                            <FormControl 
                                className="bookmarks"
                                componentClass="div"
                                style={{backgroundColor: this.state.showBookmarkZone ? "#d1ecf1" : "#fff"}}
                                onDragOver={(e) => {this.handleDragOver(e)}}
                                onDrop={(e) => {this.handleDrop(e)}}
                                >
                                {this.state.bookmarkFiles.map((file, i) => {
                                    return( 
                                        <div
                                            className="file" 
                                            key={i} 
                                            onClick={(e) => this.handleFileSelected(file)}>
                                            {cleanPath(file.path + '/' + file.name)}
                                        </div>
                                    )
                                })}
                            </FormControl>
                        </Col>
                    </Row>
                </div>
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
                                    <DimensionDnDContainer key={axisName} index={i} axis={axis} axisName={axisName} handleDimensionValueChange={(values) => this.handleDimensionValueChange(values, axisName)} moveDimension={(dragIndex, hoverIndex) => this.moveDimension(dragIndex, hoverIndex)} />
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
            </div>
        )
    }
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

export default FileTab