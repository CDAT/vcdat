import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal, Button, Dropdown, MenuItem } from 'react-bootstrap';
import _ from 'lodash'
import ColorPicker from './ColorPicker.jsx'
import ColormapWidget from './ColormapWidget.jsx'
var colorUtility = require('react-color/lib/helpers/color.js').default;

class ColormapEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: colorUtility.toState("#333"),
            showImportExportModal: false,
        }
    }

    static get propTypes() {
        return {
            show: React.PropTypes.bool.isRequired, // show the modal
            close: React.PropTypes.func.isRequired, // close the modal
            sheet_num_cols: React.PropTypes.number,
            sheet_num_rows: React.PropTypes.number,
        }; 
    }

    handleChange(color) {
        this.setState({ currentColor: color })
    }

    closeImportExportModal(){
        this.setState({showImportExportModal: false})
    }

    openImportExportModal(){
        this.setState({showImportExportModal: true})
    }

    getApplyButton(){
        if(this.props.sheet_num_rows < 2 && this.props.sheet_num_cols < 2){
            return(
                <Button
                    id="colormap-apply-dropup"
                    style={{float: "left", marginLeft: "5px"}}
                    onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>
                    Apply
                </Button>
            )
        }
        else{
            let menuItems;
            if(this.props.sheet_num_rows > 2 || this.props.sheet_num_cols > 2){
                let rows = _.range(this.props.sheet_num_rows)
                let cols = _.range(this.props.sheet_num_cols)
                let cells = [];
                rows.forEach((row)=>{
                    cols.forEach((col)=>{
                        cells.push({row: row, col: col})
                    })
                })
                 
                menuItems = (
                    <Dropdown.Menu className="colormap-apply-menu">
                    {
                        cells.map((cell, index)=>{
                            return <MenuItem
                                    key={index.toString()} 
                                    eventKey={index.toString()}
                                    onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(cell.row, cell.col)}}>
                                    To Row {cell.row+1}, Col {cell.col+1}
                                    </MenuItem>
                        })
                    }
                    </Dropdown.Menu>
                )
            }
            else if(this.props.sheet_num_rows >= 2 && this.props.sheet_num_cols == 2){
                menuItems = (
                    <Dropdown.Menu className="colormap-apply-menu">
                        <MenuItem eventKey="0" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>To Top Left</MenuItem>
                        <MenuItem eventKey="1" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 1)}}>To Top Right</MenuItem>
                        <MenuItem eventKey="2" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 0)}}>To Bottom Left</MenuItem>
                        <MenuItem eventKey="3" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 1)}}>To Bottom Right</MenuItem>
                    </Dropdown.Menu>
                )
            }
            else if(this.props.sheet_num_rows == 2 && this.props.sheet_num_cols == 2){
                menuItems = (
                    <Dropdown.Menu className="colormap-apply-menu">
                        <MenuItem eventKey="0" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>To Top Left</MenuItem>
                        <MenuItem eventKey="1" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 1)}}>To Top Right</MenuItem>
                        <MenuItem eventKey="2" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 0)}}>To Bottom Left</MenuItem>
                        <MenuItem eventKey="3" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 1)}}>To Bottom Right</MenuItem>
                    </Dropdown.Menu>
                )
            }
            else if(this.props.sheet_num_rows == 2){
                menuItems = (
                    <Dropdown.Menu className="colormap-apply-menu">
                        <MenuItem eventKey="0" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>To Top</MenuItem>
                        <MenuItem eventKey="1" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(1, 0)}}>To Bottom</MenuItem>
                    </Dropdown.Menu>
                )
            }
            else {
                menuItems = (
                    <Dropdown.Menu className="colormap-apply-menu">
                        <MenuItem eventKey="0" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 0)}}>To Left</MenuItem>
                        <MenuItem eventKey="1" onClick={() => {this.refs.widget.getWrappedInstance().applyColormap(0, 1)}}>To Right</MenuItem>
                    </Dropdown.Menu>
                )
            }
            return(
                <Dropdown 
                    dropup
                    id="colormap-apply-dropup"
                    style={{float: "left", marginLeft: "5px"}}>
                    <Dropdown.Toggle>Apply</Dropdown.Toggle>   
                    {menuItems}
                </Dropdown>
            )
        }
    }

    render(){
        let apply = this.getApplyButton();
        return(
            <div>
                <Modal show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Colormap Editor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ColorPicker 
                            color={this.state.currentColor}
                            onChange={(color) => {this.handleChange(color)}}/>
                        <ColormapWidget 
                            ref="widget"
                            color={this.state.currentColor} 
                            onChange={(color) => {this.handleChange(color)}}
                            showImportExportModal={this.state.showImportExportModal}
                            closeImportExportModal={this.closeImportExportModal.bind(this)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().blendColors()}}>
                            Blend
                        </Button>
                        <Button 
                            style={{float: "left"}}
                            onClick={() => {this.refs.widget.getWrappedInstance().resetColormap()}}>
                            Reset
                        </Button>
                        {apply}
                        <Button onClick={this.openImportExportModal.bind(this)}>Import/Export</Button>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sheet_num_rows: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].row_count,
        sheet_num_cols: state.present.sheets_model.sheets[state.present.sheets_model.cur_sheet_index].col_count,
    }
}

export default connect(mapStateToProps)(ColormapEditor);
export {ColormapEditor as PureColormapEditor}