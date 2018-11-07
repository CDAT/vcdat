import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import SavePlot from './SavePlot/SavePlot.jsx'

class ExportModal extends Component {

    constructor(props) {
        super(props);
        
        this.minWidth = 512;
        this.minHeight = 512;
        this.maxWidth = 4096;
        this.maxHeight = 4096;

        this.state = {
            exportWidth: 1024,
            exportHeight: 768,
            exportType: 'png'
        }
        
        this.handleChangeExt = this.handleChangeExt.bind(this);
        this.handleDimensionUpdate = this.handleDimensionUpdate.bind(this);
        this.handleDimensionChange = this.handleDimensionChange.bind(this);
        this.handleDimensionExit = this.handleDimensionExit.bind(this);
    }

    handleChangeExt(type){
        this.setState({exportType: type});
    }

    handleDimensionUpdate(dimensions){
        this.setState({exportWidth: dimensions[0], exportHeight: dimensions[1]});
    }

    handleDimensionChange(e, dim){
        if (!e.target.validity.badInput) {
            let value = Number(e.target.value);
            this.setState({[dim]: value});
        }
    }

    handleDimensionExit(e, dim){
        if (!e.target.validity.badInput) {
            let value = Number(e.target.value);
            if(e.target.validity.rangeOverflow){
                value = Number(e.target.max);
            }
            else if(e.target.validity.rangeUnderflow){
                value = Number(e.target.min);
            }
            this.setState({[dim]: value});
        }
    }

    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Export</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Plot Export Dimensions</label><br />
                        <label htmlFor="widthInput" style={{float: "left", margin: "5px"}} >Width: </label>
                        <input
                            name="widthInput"
                            type="number"
                            min={this.minWidth}
                            max={this.maxWidth}
                            style={{width: "150px", float: "left"}}
                            value={this.state.exportWidth}
                            pattern="[0-9]"
                            className="form-control"
                            placeholder="width"
                            onChange={(e) => this.handleDimensionChange(e,"exportWidth")}
                            onBlur={(e) => this.handleDimensionExit(e,"exportWidth")}
                        />
                        <label htmlFor="heightInput" style={{float: "left", margin: "5px"}} >Height: </label>
                        <input
                            name="heightInput"
                            type="number"
                            min={this.minHeight}
                            max={this.maxHeight}
                            style={{width: "150px", float: "left"}}
                            value={this.state.exportHeight}
                            pattern="[0-9]"
                            className="form-control"
                            placeholder="height"
                            onChange={(e) => this.handleDimensionChange(e,"exportHeight")}
                            onBlur={(e) => this.handleDimensionExit(e,"exportHeight")}
                        />
                        <label htmlFor="ext" style={{float: "left", margin: "5px"}} >Export Type: </label>
                        <label style={{float: "left", margin: "5px"}}> PNG 
                            <input 
                                type="radio"
                                name="ext"
                                value="png" 
                                checked={this.state.exportType==='png'}
                                onChange={(e) => this.handleChangeExt(e.target.value)}
                            />
                        </label>
                        <label style={{float: "left", margin: "5px"}}> PDF 
                            <input 
                                type="radio"
                                name="ext"
                                value="pdf" 
                                checked={this.state.exportType==='pdf'}
                                onChange={(e) => this.handleChangeExt(e.target.value)}
                            />
                        </label>
                        <label style={{float: "left", margin: "5px"}}> SVG 
                            <input
                                type="radio"
                                name="ext"
                                value="svg" 
                                checked={this.state.exportType==='svg'}
                                onChange={(e) => this.handleChangeExt(e.target.value)}
                            />
                        </label>
                    </form>
                    <br />
                    <hr />
                    <SavePlot 
                        exportDimensions={[this.state.exportWidth,this.state.exportHeight]}
                        exportType={this.state.exportType}
                        handleChangeExt={this.handleChangeExt}
                        handleDimensionUpdate={this.handleDimensionUpdate}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

ExportModal.propTypes = {
    selected_cell_id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
}

export default ExportModal
