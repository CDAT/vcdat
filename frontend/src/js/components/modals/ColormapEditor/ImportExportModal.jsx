import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ColormapWidget.css'

class ImportExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            data: "",
            importName: "",
            importColormap: [],
        }
    }

    static get propTypes() { 
        return { 
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
            currentColormap: React.PropTypes.array,
            saveColormap: React.PropTypes.func,
        }; 
    }

    handleChange(e) {
        let colormap = {
            name: e.target.value,
            colormap: this.props.currentColormap,
        }
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colormap));
        this.setState({
            name: e.target.value,
            data: data
        })
    }

    handleFileChange(e){
        let reader = new FileReader()
        function handleLoad(){
            let obj = {}
            try{
                obj = JSON.parse(reader.result);
            }
            catch(err){
                console.error(err)
                console.error("Unable to import colormap. Please check that the file contains valid json.")
                return
            }
            let keys = Object.keys(obj)
            if(keys.indexOf("name") === -1 || keys.indexOf("colormap") === -1){
                console.error(
                    "Unable to import colormap. Please check that the file contains both 'name' and 'colormap' keys."
                )
                return
            }
            this.setState({importName: obj.name, importColormap: obj.colormap})
        }
        reader.onload = handleLoad.bind(this)
        reader.readAsText(e.target.files[0])
    }

    importColormap(){
        this.props.saveColormap(this.state.importName, this.state.importColormap) 
    }

    render(){
        return(
            <div>
                <Modal id="export-modal" show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Import/Export Colormaps</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Export Current Colormap</h4>
                        <input 
                            type="text"
                            value={this.state.name}
                            onChange={(e)=>{this.handleChange(e)}}>
                        </input>
                        <Button
                            className="btn btn-primary"
                            href={this.state.data}
                            download={this.state.name}>
                            Download
                        </Button>
                        <hr/>
                        <h4>Import a Colormap</h4>
                        <input
                            type="file"
                            onChange={(e)=>{this.handleFileChange(e)}}>
                        </input>
                        <Button 
                            className="btn btn-primary"
                            onClick={()=>{this.importColormap()}}>
                            Upload
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ImportExportModal;