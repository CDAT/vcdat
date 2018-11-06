import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'
import './SavePlot.scss'

class SavePlot extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            img_url: "",
        }
        this.savePlot = this.savePlot.bind(this);
        this.canvasDiv = null;
    }

    /* istanbul ignore next */
    componentDidMount(){
        
        let elements = document.querySelectorAll(`.cell-stack-top > #canvas_${this.props.selected_cell_id} > canvas`);
        if(elements && elements.length > 0){
            this.canvasDiv = elements[0];

            this.canvasDiv.toBlob((blob)=>{
                this.setState({img_url: URL.createObjectURL(blob)})
            });
        }
    }
    /* istanbul ignore next */
    savePlot(){

        if(this.canvasDiv){

            // Validate screenshot name
            let fileName = this.state.name;

            if(fileName==""){
                toast.warn("Enter a filename.", {position: toast.POSITION.BOTTOM_CENTER});
                return;
            }
            var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
            switch(ext){
                case "png":
                case "svg":
                case "pdf":
                case "ps":
                    break;
                default:
                    if(ext===fileName){
                        ext = "png";
                        fileName = fileName + "." + ext;
                        this.setState({"name": fileName});
                    }
                    else {
                        toast.warn("Invalid extension name used.", {position: toast.POSITION.BOTTOM_CENTER});
                        return;
                    }
            }
            
            // Prepare parameters
            // format of `sheet_row_col`. Ex: "0_0_0"
            let sheet_row_col = this.props.selected_cell_id.split("_").map(function (str_val) { return Number(str_val) });
            let sheet = sheet_row_col[0];
            let row = sheet_row_col[1];
            let col = sheet_row_col[2];
            
            // Get info about the plot from redux store props
            let plotInfo = this.props.sheets_model.sheets[sheet].cells[row][col].plots[0];

            let variable = {
                uri: this.props.variables[plotInfo.variables[0]].path,
                variable: this.props.variables[plotInfo.variables[0]].cdms_var_name,
            };

            let graphicMethod = this.props.graphics[plotInfo.graphics_method_parent][plotInfo.graphics_method];

            // Initialize canvas object and plot
            let canvas = vcs.init(this.canvasDiv);
            
            canvas.plot(variable, graphicMethod, plotInfo.template).then((info) => {
                console.log(info);
                canvas.screenshot(ext, true, false, fileName,2000, 1200).then((result, msg) => {
                    console.log(msg);
                    if(result.success){
                        const { blob, type } = result;
                        console.log(type + " file was saved.");

                        FileSaver.saveAs(blob, this.state.name);
                        //this.props.onSave();
                        toast.success("Plot saved!", {position: toast.POSITION.BOTTOM_CENTER});
                    } else {
                        console.log(result.msg);
                    }
                    
                }).catch((err) => {
                    console.log(err);
                    toast.error("Error occurred when saving plot.", {position: toast.POSITION.BOTTOM_CENTER});
                });
            }).catch((err) => {
                console.log(err);
                toast.error("Error occurred when plotting.", {position: toast.POSITION.BOTTOM_CENTER});
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

const mapStateToProps = (state) => {

    return {
        selected_cell_id: state.present.sheets_model.selected_cell_id,
        sheets_model: state.present.sheets_model,
        variables: state.present.variables,
        graphics: state.present.graphics_methods
    }
}

SavePlot.propTypes = {
    onTryClose: PropTypes.func,
    show: PropTypes.bool,
    selected_cell_id: PropTypes.string,
    // Added for save plot functionality:
    onSave: PropTypes.func,
    variables: PropTypes.any,
    graphics: PropTypes.any,
    sheets_model: PropTypes.any
}

export default connect(mapStateToProps, null)(SavePlot)