import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import './ColormapWidget.css'

class ImportExportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            data: "",
            importName: "",
            importColormap: [],
            colormapData: ""
        }
    }

    static get propTypes() {
        return {
            show: PropTypes.bool.isRequired, // show the modal
            close: PropTypes.func.isRequired, // close the modal
            current_colormap: PropTypes.array,
            current_colormap_name: PropTypes.string,
            saveColormap: PropTypes.func,
            createNewColormap: PropTypes.func
        };
    }

    handleChange(e) {
        let colormap = {
            name: e.target.value,
            colormap: this.props.current_colormap,
        }

        // TODO: this can be removed
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colormap));
        this.setState({
            name: e.target.value,
            data: data,
            colormapData: this.props.current_colormap

        })
    }

    handleFileChange(e){
        let reader = new window.FileReader()
        function handleLoad(event){
            let obj = {}
            try{
                obj = JSON.parse(event.target.result);
            }
            catch(err){
                console.error(err)
                console.error("Unable to import colormap. Please check that the file contains valid json.")
                return
            }
            // TODO: check keys of obj for "name" and "colormap" to see if in the old json format; otherwise convert to old format
            let old_json_format = {}
            let name = Object.keys(obj["Cp"])[0]
            old_json_format["name"] = name
            old_json_format["colormap"] = []
            let myColorValues = Object(obj["Cp"][name]["index"]["data"]);
            for (let i=0 ; i < Object.keys(myColorValues).length; i++){
              old_json_format["colormap"].push(myColorValues[String(i)])
            }
            obj = old_json_format
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

    exportColormap(){
      const name = this.state.name.substring(0, this.state.name.indexOf( ".json" ));
      let myObject = {"Cp":{}};
      myObject["Cp"][name] = {"index": {"data": {}}}
      for (var i = 0; i < this.state.colormapData.length; i++){
        myObject["Cp"][name]["index"]["data"][i] = this.state.colormapData[i]
      }

      // Create hidden anchor tag for downloading the dynamically create JSON object
      var element = document.createElement('a');
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myObject));
      element.setAttribute('href', dataStr);
      element.setAttribute('download', this.state.name);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    }

    importColormap(){
        this.props.createNewColormap(this.state.importName, this.props.current_colormap_name)
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
                        <div className="form-group form-inline">
                            <input
                                placeholder="filename.json"
                                className="form-control"
                                type="text"
                                value={this.state.name}
                                onChange={(e)=>{this.handleChange(e)}}>
                            </input>
                            <Button
                                id="downloadAnchorElem"
                                className="btn btn-primary form-control"
                                onClick={()=>{this.exportColormap()}}>
                                Download
                            </Button>
                        </div>
                        <hr/>
                        <h4>Import a Colormap</h4>
                        <div className="form-group form-inline">
                            <input
                                style={{display: "inline-block"}}
                                className="form-control"
                                type="file"
                                onChange={(e)=>{this.handleFileChange(e)}}>
                            </input>
                            <Button
                                className="btn btn-primary form-control"
                                onClick={()=>{this.importColormap()}}>
                                Upload
                            </Button>
                        </div>
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
