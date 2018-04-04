import React, { Component } from 'react'
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
        this.savePlot = this.savePlot.bind(this)
    }

    componentDidMount(){
        let elements = document.querySelectorAll(`.cell-stack-top > #canvas_${this.props.selected_cell_id} > canvas`)
        if(elements && elements.length > 0){
            let canvas = elements[0]
            canvas.toBlob((blob)=>{
                this.blob = blob
                this.setState({img_url: URL.createObjectURL(blob)})
            })
        }
    }
    
    savePlot(){
        if(this.blob){
            FileSaver.saveAs(this.blob, this.state.name)
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
    onTryClose: React.PropTypes.func,
    show: React.PropTypes.bool,
    selected_cell_id: React.PropTypes.string,
}

export default connect(mapStateToProps, null)(SavePlot)