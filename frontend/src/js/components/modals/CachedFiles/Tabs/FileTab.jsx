import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Button, Row, Col, Glyphicon, FormGroup, FormControl, ControlLabel, InputGroup } from "react-bootstrap";
import _ from "lodash";
import Dialog from "react-bootstrap-dialog";
import { DropTarget, DragSource } from "react-dnd";
import { findDOMNode } from "react-dom";
import { toast } from "react-toastify";

import Actions from "../../../../constants/Actions.js";
import DimensionSlider from "./../DimensionSlider/DimensionSlider.jsx";
import FileExplorer from "../../FileExplorer/FileExplorer.jsx";
import DragAndDropTypes from "../../../../constants/DragAndDropTypes.js";
import FileInfoModal from "../../FileInfoModal/FileInfoModal.jsx";

import "../CachedFiles.scss";
import AxisTransform from "../AxisTransform.jsx";

function cleanPath(path) {
    return `/${path
        .split("/")
        .filter(segment => segment)
        .join("/")}`;
}

function getDefaultVariable(names) {
    // The select box for variables needs to attempt to choose a default variable.
    // This function attempts to return an index for an entry in the array that is unlikely to be a bounds variable.
    // If no suitable candidate is found, will return 0

    const substrings = ["bound", "bnds", "lat", "lon", "axis"]; // substrings that indicate a bounds variable
    const sorted_names = names.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (let name of sorted_names) {
        const is_variable = substrings.reduce((prev_val, substring) => {
            return prev_val && !name.includes(substring); // assume name is a variable until detected otherwise
        }, true);

        if (is_variable) {
            return name; // return the name of the first variable that doesnt represent a bound
        }
    }
    return sorted_names[0]; // return the first name if none matched
}

const HISTORY_KEY = "variable_history_files";
const BOOKMARK_KEY = "variable_bookmark_files";

class FileTab extends Component {
    constructor(props) {
        super(props);
        let history_files;
        let bookmark_files;
        try {
            history_files = JSON.parse(window.localStorage.getItem(HISTORY_KEY));
            if (!Array.isArray(history_files)) {
                history_files = [];
            }
        } catch (e) {
            history_files = [];
        }
        try {
            bookmark_files = JSON.parse(window.localStorage.getItem(BOOKMARK_KEY));
            if (!Array.isArray(bookmark_files)) {
                bookmark_files = [];
            }
        } catch (e) {
            bookmark_files = [];
        }
        this.state = {
            showFileExplorer: false,
            showRedefineVariableModal: false,
            selectedFile: "",
            historyFiles: history_files,
            bookmarkFiles: bookmark_files,
            showBookmarkZone: false,
            variablesAxes: null,
            axisTransforms: {},
            selectedVariable: null,
            selectedVariableName: "",
            redefinedVariableName: "",
            temporaryRedefinedVariableName: "",
            dimension: null,
            recent_path: "",
            showFileInfoModal: false
        };
        this.handleCloseFileInfoModal = this.handleCloseFileInfoModal.bind(this);
        this.handleAxisTransform = this.handleAxisTransform.bind(this);
    }

    get selectedFilePath() {
        return !this.state.selectedFile ? "" : cleanPath(this.state.selectedFile.path + "/" + this.state.selectedFile.name);
    }

    get variableName() {
        if (this.state.redefinedVariableName) {
            return this.state.redefinedVariableName;
        }
        return !this.state.selectedVariableName ? "" : this.state.selectedVariableName;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedVariableName !== prevState.selectedVariableName || (this.state.selectedVariableName && !this.state.selectedVariable)) {
            let selectedVariable, dimension;
            if (this.state.variablesAxes[0][this.state.selectedVariableName]) {
                // it's a variablevar
                selectedVariable = this.state.variablesAxes[0][this.state.selectedVariableName];
                dimension = selectedVariable.axisList.map(axisName => {
                    return { axisName };
                });
            } else {
                // it's a axis
                selectedVariable = this.state.variablesAxes[1][this.state.selectedVariableName];
                dimension = { axisName: this.state.selectedVariableName };
            }
            this.setState({
                selectedVariable,
                dimension
            });
        }
    }

    loadVariable() {
        let variable = this.state.selectedVariableName;
        let filename = this.state.selectedFile;
        let path = this.selectedFilePath;

        let var_obj = {};
        var_obj[this.variableName] = {
            cdms_var_name: variable,
            axisList: this.state.selectedVariable.axisList,
            filename: filename,
            path: path,
            dimension: this.state.dimension,
            transforms: this.state.axisTransforms
        };

        this.props.loadVariables([var_obj]);
        toast.success(`Successfully Loaded ${variable}`, { position: toast.POSITION.BOTTOM_CENTER });
        this.setState({ redefinedVariableName: "" });
    }

    load() {
        return this.variableNameExists()
            .then(result => {
                if (result) {
                    return new Promise((resolve, reject) => {
                        this.refs.dialog.show({
                            title: "Variable exists",
                            body: `The variable name ${this.variableName} already exists, rename or overwrite existing variable`,
                            actions: [Dialog.OKAction(() => resolve()), Dialog.CancelAction(() => reject())]
                        });
                    }).then(() => this.redefineVariableName());
                }
            })
            .then(() => {
                return this.loadVariable();
            })
            .catch(e => {
                if (e) {
                    console.warn(e);
                }
            });
    }

    /* istanbul ignore next */
    loadAndClose() {
        this.load().then(() => this.props.onTryClose());
    }

    loadAs() {
        this.redefineVariableName().then(() => {
            this.loadVariable();
        });
    }

    /* istanbul ignore next */
    variableNameExists() {
        return Promise.resolve(this.variableName in this.props.curVariables);
    }

    redefineVariableName() {
        return new Promise((resolve, reject) => {
            this.doneRedefineVariable = () => {
                resolve();
            };
            this.setState({
                showRedefineVariableModal: true,
                temporaryRedefinedVariableName: this.variableName
            });
        });
    }

    /* istanbul ignore next */
    handleFileExplorerTryClose() {
        this.setState({ showFileExplorer: false });
    }

    handleFileSelected(file) {
        var path = cleanPath(file.path + "/" + file.name);
        var self = this;
        let recent_path = cleanPath(file.path);
        this.props.setRecentFolderOpened(recent_path);
        return new Promise((resolve, reject) => {
            try {
                resolve(
                    vcs.allvariables(path).then(
                        variablesAxes => {
                            // success
                            var historyFiles = [
                                file,
                                ...self.state.historyFiles.filter(historyFile => {
                                    return historyFile.path !== file.path || historyFile.name !== file.name;
                                })
                            ];
                            window.localStorage.setItem(HISTORY_KEY, JSON.stringify(historyFiles));
                            const selected_variable = getDefaultVariable(Object.keys(variablesAxes[0]));
                            self.setState({
                                variablesAxes,
                                selectedFile: file,
                                historyFiles: historyFiles,
                                selectedVariableName: selected_variable,
                                selectedVariable: null,
                                showFileExplorer: false
                            });
                        },
                        error => {
                            // error
                            if (!(error instanceof ReferenceError)) {
                                console.error(error);
                                switch (error.code) {
                                    case -32001: // CDMSError(u'Cannot open file /example/path/to/a/file.nc (No error)',)
                                        toast.error("CDMS can not open this file, please select another", {
                                            position: toast.POSITION.BOTTOM_CENTER
                                        });
                                        return;
                                    case -32099:
                                        toast.error("VCS connection is closed. Try restarting vCDAT.", {
                                            position: toast.POSITION.BOTTOM_CENTER
                                        });
                                        return;
                                    default:
                                        toast.error("Failed to load file. Please try another one.", {
                                            position: toast.POSITION.BOTTOM_CENTER
                                        });
                                        return;
                                }
                            }
                        }
                    )
                );
            } catch (e) {
                if (e instanceof ReferenceError) {
                    toast.error("VCS is not loaded. Try restarting vCDAT", { position: toast.POSITION.BOTTOM_CENTER });
                }
                console.warn(e);
                reject(e);
            }
        });
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

    handleDragStart(event, file, option) {
        let data = _.assign({}, file);
        event.dataTransfer.setData("text", JSON.stringify(data)); // datatype must be text/plain due to chrome bug
        this.setState({ showBookmarkZone: true });
    }

    /* istanbul ignore next */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation(); // Stupid drag and drop api issue
    }

    handleDrop(event) {
        try {
            let file = JSON.parse(event.dataTransfer.getData("text"));
            let bookmarks = _.cloneDeep(this.state.bookmarkFiles);
            for (let bookmark of bookmarks) {
                if (bookmark.name === file.name && cleanPath(bookmark.path) === cleanPath(file.path)) {
                    return; // the file is already bookmarked, don't add it again
                }
            }
            bookmarks.push(file);
            window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
            this.setState({ bookmarkFiles: bookmarks });
        } catch (e) {
            console.error(e);
            return;
        }
    }

    handleDragEnd(event, option) {
        this.setState({ showBookmarkZone: false });
    }

    handleDeleteBookmark(index) {
        if (this.state.bookmarkFiles.length > index) {
            let bookmarks = _.cloneDeep(this.state.bookmarkFiles);
            bookmarks.splice(index, 1);
            window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
            this.setState({ bookmarkFiles: bookmarks });
        } else {
        /* istanbul ignore next */
            console.warn("Bookmark index not in range.");
        }
    }

    handleCloseFileInfoModal() {
        this.setState({ showFileInfoModal: false });
    }

    handleAxisTransform(axis_name, transform) {
        let new_transforms = _.cloneDeep(this.state.axisTransforms);
        new_transforms[axis_name] = transform;
        this.setState({
            axisTransforms: new_transforms
        });
    }

    render() {
        let selected_file_path = "";
        if (this.state.selectedFile) {
            selected_file_path = cleanPath(this.state.selectedFile.path) + "/" + this.state.selectedFile.name;
        }
        return (
            <div>
                <Modal.Body>
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
                                        <Button bsStyle="primary" onClick={() => this.setState({ showFileExplorer: true })}>
                                            <Glyphicon glyph="file" />
                                        </Button>
                                        <Button
                                            bsStyle="default"
                                            disabled={!this.state.selectedFile}
                                            onClick={() => this.setState({ showFileInfoModal: true })}
                                        >
                                            <Glyphicon glyph="info-sign" />
                                        </Button>
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
                                    onChange={e => this.setState({ selectedVariableName: e.target.value })}
                                    value={this.state.selectedVariableName}
                                >
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
                                                onDragStart={e => {
                                                    this.handleDragStart(e, file);
                                                }}
                                                onDragEnd={e => {
                                                    this.handleDragEnd(e);
                                                }}
                                                onClick={e => this.handleFileSelected(file)}
                                            >
                                                {cleanPath(file.path + "/" + file.name)}
                                            </div>
                                        );
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
                                    style={{ backgroundColor: this.state.showBookmarkZone ? "#d1ecf1" : "#fff" }}
                                    onDragOver={e => {
                                        this.handleDragOver(e);
                                    }}
                                    onDrop={e => {
                                        this.handleDrop(e);
                                    }}
                                >
                                    {this.state.bookmarkFiles.map((file, i) => {
                                        return (
                                            <div className="bookmark" key={i}>
                                                <div
                                                    className="file"
                                                    draggable="true"
                                                    onDragStart={e => {
                                                        this.handleDragStart(e, file);
                                                    }}
                                                    onDragEnd={e => {
                                                        this.handleDragEnd(e);
                                                    }}
                                                    onClick={e => this.handleFileSelected(file)}
                                                >
                                                    {cleanPath(file.path + "/" + file.name)}
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-xs delete-bookmark-button"
                                                    onClick={() => {
                                                        this.handleDeleteBookmark(i);
                                                    }}
                                                >
                                                    <Glyphicon glyph="trash" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </FormControl>
                            </Col>
                        </Row>
                    </div>
                    {this.state.selectedVariable && (
                        <div className="dimensions">
                            <Row>
                                <Col className="text-right" sm={2}>
                                    <h4>Dimensions</h4>
                                </Col>
                            </Row>
                            {/* If is a variable */}
                            {/* Then we likely have many axes. They need to be reorderable so use the DnDContainer */}
                            {this.state.dimension &&
                                Array.isArray(this.state.dimension) &&
                                this.state.dimension.map(dimension => dimension.axisName).map((axisName, i) => {
                                    let axis = this.state.variablesAxes[1][axisName];
                                    return (
                                        <div key={axisName} className="axis">
                                            <DimensionDnDContainer
                                                index={i}
                                                axis={axis}
                                                axisName={axisName}
                                                handleDimensionValueChange={values => this.handleDimensionValueChange(values, axisName)}
                                                moveDimension={(dragIndex, hoverIndex) => this.moveDimension(dragIndex, hoverIndex)}
                                                axis_transform={this.state.axisTransforms[axisName] || "def"}
                                                handleAxisTransform={this.handleAxisTransform}
                                            />
                                        </div>
                                    );
                                })}
                            {/* if is an Axis */}
                            {/* Then there will only be one slider. No need to make it drag and drop */}
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
                    <Button
                        bsStyle="primary"
                        onClick={e => {
                            this.load();
                        }}
                    >
                        Load
                    </Button>
                    <Button
                        bsStyle="primary"
                        onClick={e => {
                            this.loadAndClose();
                        }}
                    >
                        Load and Close
                    </Button>
                    <Button
                        bsStyle="primary"
                        onClick={e => {
                            this.loadAs();
                        }}
                    >
                        Load As
                    </Button>
                    <Button bsStyle="default" onClick={() => this.props.onTryClose()}>
                        Close
                    </Button>
                </Modal.Footer>
                <Modal show={this.state.showRedefineVariableModal}>
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-sm">Rename variable</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>Variable name</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.temporaryRedefinedVariableName}
                                onChange={e => this.setState({ temporaryRedefinedVariableName: e.target.value })}
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            bsStyle="primary"
                            onClick={() => {
                                if (this.state.temporaryRedefinedVariableName) {
                                    this.doneRedefineVariable();
                                    this.setState({
                                        redefinedVariableName: this.state.temporaryRedefinedVariableName,
                                        showRedefineVariableModal: false
                                    });
                                }
                            }}
                        >
                            Confirm
                        </Button>
                        <Button onClick={() => this.setState({ showRedefineVariableModal: false })}>Close</Button>
                    </Modal.Footer>
                </Modal>
                {this.state.showFileInfoModal && (
                    <FileInfoModal show={this.state.showFileInfoModal} onTryClose={this.handleCloseFileInfoModal} file={selected_file_path} />
                )}
                <Dialog ref="dialog" />
                {this.state.showFileExplorer && (
                    <FileExplorer
                        show={true}
                        onTryClose={() => this.handleFileExplorerTryClose()}
                        onFileSelected={file => this.handleFileSelected(file)}
                        recent_path={this.props.recent_path}
                    />
                )}
            </div>
        );
    }

    _formatvariablesAxes() {
        return (
            this.state.variablesAxes && [
                <optgroup key="variables" label="---Variables---">
                    {this._formatVariables(this.state.variablesAxes[0])}
                </optgroup>,
                <optgroup key="axes" label="---Axes---">
                    {this._formatAxes(this.state.variablesAxes[1])}
                </optgroup>
            ]
        );
    }

    _formatVariables(variables) {
        return Object.keys(variables)
            .sort()
            .map(variableName => {
                // let variable = variables[variableName];
                // let label = `${variableName} (${variable.shape.join(',')}) ${variable.name}`
                var vars = variables;
                var v = variableName;
                var shape = " (" + vars[v].shape[0];
                for (let i = 1; i < vars[v].shape.length; ++i) {
                    shape += "," + vars[v].shape[i];
                }
                shape += ")";
                // axes for the variable
                var al = vars[v].axisList;
                var axisList = "(" + al[0];
                for (let i = 1; i < al.length; ++i) {
                    axisList += ", " + al[i];
                }
                axisList += ")";
                // bounds are received for longitude and latitude
                var boundsString = "";
                if (vars[v].bounds) {
                    boundsString += ": (" + vars[v].bounds[0] + ", " + vars[v].bounds[1] + ")";
                }
                // longitude, latitude for the variable
                // these are different than the axes for the curvilinear or
                // generic grids
                var lonLat = null;
                if (vars[v].lonLat) {
                    lonLat = "(" + vars[v].lonLat[0] + ", " + vars[v].lonLat[1] + ")";
                }
                var label = v + shape + " [" + vars[v].name + ", " + vars[v].units + boundsString + "] " + ": " + axisList;
                if (lonLat) {
                    label += ", " + lonLat;
                }
                if (vars[v].gridType) {
                    label += ", " + vars[v].gridType;
                }

                return (
                    <option key={v} value={v}>
                        {label}
                    </option>
                );
            });
    }

    _formatAxes(axes) {
        return Object.keys(axes).map(axisName => {
            var v = axisName;
            var shape = "(" + axes[v].shape[0];
            for (let i = 1; i < axes[v].shape.length; ++i) {
                shape += "," + axes[v].shape[i];
            }
            shape += ")";
            var label =
                v + shape + "[" + axes[v].name + ", " + axes[v].units + ": (" + axes[v].data[0] + ", " + axes[v].data[axes[v].data.length - 1] + ")]";
            return (
                <option key={axisName} value={axisName}>
                    {label}
                </option>
            );
        });
    }

    moveDimension(dragIndex, hoverIndex) {
        var dimensions = this.state.dimension.slice();
        dimensions.splice(hoverIndex, 0, dimensions.splice(dragIndex, 1)[0]);
        this.setState({ dimension: dimensions });
    }
}
FileTab.propTypes = {
    onTryClose: PropTypes.func.isRequired,
    cachedFiles: PropTypes.object,
    curVariables: PropTypes.object.isRequired,
    loadVariables: PropTypes.func,
    switchTab: PropTypes.func,
    selectedTab: PropTypes.string,
    setRecentFolderOpened: PropTypes.func
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

const mapStateToProps = state => {
    return {
        recent_path: state.present.cached_files.recent_local_path
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setRecentFolderOpened: function(path) {
            dispatch(Actions.setRecentLocalPath(path));
        }
    };
};

export { getDefaultVariable };
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileTab);
