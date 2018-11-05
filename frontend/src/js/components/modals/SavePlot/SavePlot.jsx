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
            
            // this.canvas = vcs.init(canvas_el);
            // this.canvas.plot(this.props.plots.plotVariables)

            this.canvasDiv.toBlob((blob)=>{
                this.blob = blob
                this.setState({img_url: URL.createObjectURL(blob)})
            });
            /* vcs.creategraphicsmethod('boxfill', 'myboxfill').then((gm) => {
                return this.canvas.plot(dataSpecs, this.props.plotGMs[index], plot.template).then(
                    success => {
                        return;
                    },
                    error => {
                        this.canvas.close();
                        delete this.canvas;
                        this.canvas = vcs.init(this.div);
                        if (error.data) {
                            console.warn("Error while plotting: ", error);
                            toast.error(error.data.exception, { position: toast.POSITION.BOTTOM_CENTER });
                        } else {
                            console.warn("Unknown error while plotting: ", error);
                            toast.error("Error while plotting", { position: toast.POSITION.BOTTOM_CENTER });
                        }
                    }
                );
            });*/
        }
    }
    /* istanbul ignore next */
    savePlot(){
        if(this.canvasDiv){

            let canvas = vcs.init(document.getElementById(this.canvasDiv));
            vcs.creategraphicsmethod('boxfill', 'tsetboxfill').then((gm) => {
                console.log(gm);
                return canvas.plot(console.log({uri: 'clt.nc',variable: this.props.variables[0],}, ['boxfill', 'myboxfill']));
            }).then((r) => {
                let renderer = r;
                renderer.onImageReady(() => {
                    console.log('Ready1');
                });

                // // what if we want to plot over the first plot
                // // This seems to work just fine when uncommented, except for some
                // // slight misalignment of the vector layer
                // var dataSpec = [variables.u, variables.v];
                // var rendererPromise2 = canvas.plot(dataSpec, ['vector', 'default']);
                // rendererPromise2.then((r) => {
                //   r.onImageReady(() => {
                //     console.log('Ready2');
                //   });
                // });
            });
            
            console.log(canvas);

            console.log(this.props.selected_cell_id);
            console.log(this.props.plots[0]);
            console.log(this.props.plots[0]["graphics_method_parent"]);
            console.log(this.props.plots[0]["graphics_method"]);
            console.log(this.props.plots[0]["template"]);
            console.log(this.props.plots[0]["variables"][0]);
            console.log(this.props.variables);

            /*
            let renderPromise = this.canvas.plot(
                {uri: 'clt.nc',variable: this.props.variables[0],},
                [this.props.plots[0]["graphics_method_parent"],this.props.plots[0]["graphics_method"]],
                this.props.plots[0]["template"]).then(() => {
                success => {
                    return;
                },
                error => {
                    this.canvas.close();
                    delete this.canvas;
                    this.canvas = vcs.init(this.div);
                    if (error.data) {
                        console.warn("Error while generating save plot: ", error);
                        toast.error(error.data.exception, { position: toast.POSITION.BOTTOM_CENTER });
                    } else {
                        console.warn("Unknown error while saving plot: ", error);
                        toast.error("Error while plotting", { position: toast.POSITION.BOTTOM_CENTER });
                    }
                }
            }).then((result) => {
                console.log(result);
            });

            this.canvas.screenshot('pdf', true, false, null).then((result) => {
                console.log('Got screenshot result:');
                console.log(result);
                const { blob, type } = result;
                let pdfBlobUrl = URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.href = pdfBlobUrl;
                const fname = `image.${type}`;
                link.download = fname;
                link.innerHTML = `Click here to download ${fname}`;
                document.body.appendChild(link);
            });
            this.canvas.screenshot('png', false, true, this.state.name, 1024, 768).then((result, msg) => {
                console.log('Got screenshot result:');
                console.log(result);
                console.log(msg);
                const { blob, type } = result;
                console.log(type + " file was saved.")
                pngBlobUrl = URL.createObjectURL(blob);
            
                var img = document.createElement("img");
                img.classList.add("obj");
                img.file = blob;
                img.width = 200;
                img.height = 176;
            
                var link = document.createElement("a");
                link.href = pngBlobUrl;
                const fname = `image.${type}`;
                link.download = fname;
                link.appendChild(img);
                document.body.appendChild(link);
            
                var reader = new FileReader();
                reader.onload = function(e) {
                  img.src = e.target.result;
                };
                reader.readAsDataURL(blob);
                FileSaver.saveAs(blob, this.state.name);
            });*/
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