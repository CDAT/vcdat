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
                this.blob = blob
                this.setState({img_url: URL.createObjectURL(blob)})
            });
        }
    }
    /* istanbul ignore next */
    savePlot(){

        if(this.canvasDiv){

            // Validate screenshot name
            let fileName = this.state.name;
            var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

            switch(ext){
                case "png":
                case "svg":
                case "pdf":
                case "ps":
                    console.log("Valid extension name");
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

            // Collect parameters for screenshot from props
            let variable = {
                uri: '/Users/downie4/anaconda3/envs/vcdat/share/uvcdat/sample_data/clt.nc',
                variable: this.props.variables[0],
            };
            let graphicMethod = [this.props.plots[0].graphics_method_parent, this.props.plots[0].graphics_method];

            // Initialize canvas object and plot
            let canvas = vcs.init(this.canvasDiv);
            
            canvas.plot(variable, graphicMethod).then((info) => {
                console.log(info);
                canvas.screenshot(ext, true, false, fileName).then((result, msg) => {
                    console.log('Got screenshot result:');
                    console.log(result);
                    
                    console.log(result.success);

                    if(result.success){
                        const { blob, type } = result;
                        console.log(type + " file was saved.");

                        FileSaver.saveAs(blob, this.state.name);
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

            /*
            console.log(this.props.selected_cell_id);
            console.log(this.props.plots[0]);
            console.log(this.props.plots[0]["graphics_method_parent"]);
            console.log(this.props.plots[0]["graphics_method"]);
            console.log(this.props.plots[0]["template"]);
            console.log(this.props.plots[0]["variables"][0]);
            console.log(this.props.variables);
            */
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
        selected_cell_id: state.present.sheets_model.selected_cell_id
    }
}

SavePlot.propTypes = {
    onTryClose: PropTypes.func,
    show: PropTypes.bool,
    selected_cell_id: PropTypes.string,
    // Added for save plot functionality:
    plots: PropTypes.array,
    variables: PropTypes.array,
    plotVariables: PropTypes.array,
    plotGMs: PropTypes.array,
}

export default connect(mapStateToProps, null)(SavePlot)