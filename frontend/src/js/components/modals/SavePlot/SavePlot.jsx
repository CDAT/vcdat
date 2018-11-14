import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'
import _ from "lodash";
import './SavePlot.scss'

class SavePlot extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            img_url: "",
        }
        this.savePlot = this.savePlot.bind(this);
        this.plotAll = this.plotAll.bind(this);
        this.prepareCanvas = this.prepareCanvas.bind(this);
        this.exportDimensions = this.props.exportDimensions;
        this.exportType = this.props.exportType;
        this.canvasDiv = null;
        this.canvas = null;
        this.error = false;
        this.ready = false; // Whether canvas is ready for export
        this.notify = false; // If user clicked save before plots were finished, notify when ready.
    }

    /* istanbul ignore next */
    componentDidMount(){
        
        let elements = document.querySelectorAll(`.cell-stack-top > #canvas_${this.props.selected_cell_id} > canvas`);
        if(elements && elements.length > 0){
            this.canvasDiv = elements[0];

            // Update default dimensions to match current window size
            this.props.handleDimensionUpdate([this.canvasDiv.width,this.canvasDiv.height]);
            
            // Create plot preview thumbnail
            this.canvasDiv.toBlob((blob) => {
                this.setState({img_url: URL.createObjectURL(blob)})
            });

            // Initialize canvas object
            this.canvas = vcs.init(this.canvasDiv);

            this.prepareCanvas();
        }
    }

    prepareCanvas() {
        // Plot on the canvas for future saving and set ready flag when done
        this.plotAll().then(
            success=>{
                this.ready=true;
                this.error = false;
                if(this.notify) {
                    this.notify = false;
                    toast.success("Export ready!", {position: toast.POSITION.BOTTOM_CENTER});
                }}, 
            error=>{
                toast.warn("Plotting error occurred.", {position: toast.POSITION.BOTTOM_CENTER});
                this.error = true;
                console.log("Plotting error: ",error);

            }
        );
    }

    // Plots on the canvas all the layers
    async plotAll() {
        
        if(this.props.plots){
            for (let [index, plot] of this.props.plots.entries()) {
                await this.plot(plot, index);
            }
            console.log("Plots finished!");
        }
        else{
            console.log("Plots weren't loaded.");
        }
    }

    // This was directly taken from Canvas.jsx
    plot(plot, index) {
        if (plot.variables.length > 0) {
            var variables = this.props.plotVariables[index];
            var dataSpecs = variables.map(function(variable) {
                var dataSpec;
                if (variable.json) {
                    dataSpec = {
                        uri: variable.path,
                        variable: variable.cdms_var_name,
                        json: variable.json
                    };
                } else {
                    dataSpec = {
                        uri: variable.path,
                        variable: variable.cdms_var_name
                    };
                }

                var subRegion = {};
                variable.dimension.filter(dimension => dimension.values).forEach(dimension => {
                    subRegion[dimension.axisName] = dimension.values.range;
                });
                if (!_.isEmpty(subRegion)) {
                    dataSpec["operations"] = [{ subRegion }];
                }
                if (!_.isEmpty(variable.transforms)) {
                    if (!dataSpec["operations"]) {
                        dataSpec["operations"] = [];
                    }
                    dataSpec["operations"].push({ transform: variable.transforms });
                }
                var axis_order = variable.dimension.map(dimension => variable.axisList.indexOf(dimension.axisName));
                if (axis_order.some((order, index) => order !== index)) {
                    dataSpec["axis_order"] = axis_order;
                }
                return dataSpec;
            });
            console.log("Plot " + index + " for export.", dataSpecs, this.props.plotGMs[index], plot.template);
            return this.canvas.plot(dataSpecs, this.props.plotGMs[index], plot.template).then(
                success => {
                    console.log("Plot " + index + " complete.");
                    return;
                },
                error => {
                    this.canvas.close();
                    this.error = true;
                    delete this.canvas;
                    this.canvas = vcs.init(this.div);
                    if (error.data) {
                        console.warn("Error while creating save plot: ", error);
                        toast.error(error.data.exception, { position: toast.POSITION.BOTTOM_CENTER });
                    } else {
                        console.warn("Unknown error while saving plot: ", error);
                        toast.error("Error while saving plot.", { position: toast.POSITION.BOTTOM_CENTER });
                    }
                }
            );
        }
    }

    /* istanbul ignore next */
    savePlot(){

        if(this.canvasDiv){

            if(!this.canvas) {
                console.log("Canvas object is empty.");
                return;
            }

            // Cancel export if canvas plots aren't ready
            if(!this.ready) {

                if(this.error){
                    // If an error had occurred, try plotting again
                    this.prepareCanvas();
                }

                this.notify = true; // Set notify flag, so user will be notified when plot is ready to save
                toast.warn("Performing plotting operation again. Will notify when ready to save.", {position: toast.POSITION.BOTTOM_CENTER});
                return;
            }

            // Validate screenshot name
            let fileName = this.state.name;

            if(fileName==""){
                toast.warn("Enter a filename.", {position: toast.POSITION.BOTTOM_CENTER});
                return;
            }

            var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

            if(ext===fileName){
                ext = "";// No extension was entered
            }

            switch(ext){
                case "":
                    ext = this.props.exportType;
                    fileName = fileName + "." + ext;
                    this.setState({"name": fileName});
                    break;
                case "png":
                    this.props.handleChangeExt("png");
                    this.setState({"name": fileName});
                    break;
                case "svg":
                    this.props.handleChangeExt("svg");
                    this.setState({"name": fileName});
                    break;
                case "pdf":
                    this.props.handleChangeExt("pdf");
                    this.setState({"name": fileName});
                    break;
                default:
                    toast.warn("Invalid extension name used.", {position: toast.POSITION.BOTTOM_CENTER});
                    return;
            }
            
            // Create screenshot and save
            this.canvas.screenshot(ext, true, false, fileName, this.props.exportDimensions[0], this.props.exportDimensions[1]).then((result, msg) => {
                if(msg){
                    console.log(msg);
                }

                if(result.success){
                    const { blob, type } = result;
                    FileSaver.saveAs(blob, this.state.name);
                    toast.success("Plot saved!", {position: toast.POSITION.BOTTOM_CENTER});
                    this.setState({name:""});
                } else {
                    console.log(result.msg);
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Error occurred when saving plot.", {position: toast.POSITION.BOTTOM_CENTER});
            });
        }
        else{
            toast.warn("No image available to save.", {position: toast.POSITION.BOTTOM_CENTER});
        }
    }

    render(){
        return(
            <div className="export-plot-container">
                <div className="canvas-img-container" style={{maxWidth: "200px"}}>
                    <span>Preview:</span>
                    {
                        this.state.img_url ? 
                            <img className="img-thumbnail" src={this.state.img_url} alt="" style={{width: "100%", height: "auto"}}/>
                        :
                            <img className="img thumbnail preview-unavailable" src="" alt=""/>
                    }
                </div>
                <div className="save-plot-inputs">
                    <input
                        id="save-plot-text-input"
                        type="text"
                        className="form-control"
                        placeholder="filename"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })} 
                    />
                    <button className="btn btn-primary" onClick={this.savePlot}>Save</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    // When GMs are loaded, use this function to extract them from the state
    var get_gm_for_plot = plot => {
        return state.present.graphics_methods[plot.graphics_method_parent][plot.graphics_method];
    };

    var get_vars_for_plot = plot => {
        return plot.variables.map(variable => {
            return state.present.variables[variable];
        });
    };

    if(ownProps.plots){
        return {
            selected_cell_id: state.present.sheets_model.selected_cell_id,
            plotVariables: ownProps.plots.map(get_vars_for_plot),
            plotGMs: ownProps.plots.map(get_gm_for_plot)
        }
    }
    else {
        return {
            selected_cell_id: state.present.sheets_model.selected_cell_id,
            plotVariables: null,
            plotGMs: null
        }
    }
}

SavePlot.propTypes = {
    onTryClose: PropTypes.func,
    show: PropTypes.bool,
    selected_cell_id: PropTypes.string,
    // Added for save plot functionality:
    exportDimensions: PropTypes.array,
    handleDimensionUpdate: PropTypes.func,
    handleChangeExt: PropTypes.func,
    exportType: PropTypes.string,
    plots: PropTypes.any,
    plotVariables: PropTypes.array,
    plotGMs: PropTypes.array,
    onSave: PropTypes.func,
}

export default connect(mapStateToProps)(SavePlot);