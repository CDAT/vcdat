import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem, Collapse } from 'react-bootstrap'
import InspectorToolbar from './InspectorToolbar.jsx'

class PlotInspector extends React.Component {

    constructor(props){
        super(props)
        
    }
    getVariables(plot_index){
        try{
            return this.props.plots[plot_index].variables.map(function(name){
                return <div>{name}</div>
            })
        }
        catch(e){
            return <div></div>
        }
    }
    getGraphicsMethodParent(plot_index){
        try{
            return <div>{this.props.plots[plot_index].graphics_method_parent}</div>
        }
        catch(e){
            return ""
        }
    }
    getGraphicsMethod(plot_index){
        try{
            return <div>{this.props.plots[plot_index].graphics_method}</div>
        }
        catch(e){
            return ""
        }
    }
    getTemplate(plot_index){
        try{
            return <div>{this.props.plots[plot_index].template}</div>
        }
        catch(e){
            return ""
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid text-center">
                        <p className='side-nav-header'>Inspector</p>
                    </div>
                </nav>
                <div className='inspector-selector btn-group'>
                    <InspectorToolbar />
                    <div>
                        {
                            this.props.plots && this.props.plots.map((v, index) => {
                                return(
                                    <Collapse key={index}>
                                        <ListGroup>
                                            {this.props.plots.length > 1 ? `Plot: ${index}` : "Plot Info:"}
                                            <ListGroupItem>{
                                                this.props.plots.variables && 
                                                    this.props.plots.variables.length > 1 ? "Variables:" : "Variable:"}
                                                {this.getVariables(index)}
                                            </ListGroupItem>
                                            <ListGroupItem>GM Type: {this.getGraphicsMethodParent(index)}</ListGroupItem>
                                            <ListGroupItem>Graphics Method: {this.getGraphicsMethod(index)}</ListGroupItem>
                                            <ListGroupItem>Template: {this.getTemplate(index)}</ListGroupItem>
                                        </ListGroup>
                                    </Collapse>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

PlotInspector.propTypes = {
    selectedCell: React.PropTypes.string,
    plots: React.PropTypes.array,
}

const mapStateToProps = (state) => {
    let cell_id_string = state.present.sheets_model.selected_cell_id // format of `sheet_row_col`. Ex: "0_0_0"
    let sheet_row_col = cell_id_string.split("_").map(function (str_val) { return Number(str_val) })
    let sheet = sheet_row_col[0],
        row = sheet_row_col[1],
        col = sheet_row_col[2]
    let plots
    try{
        plots = state.present.sheets_model.sheets[sheet].cells[row][col].plots
    }
    catch(e){
        plots = undefined
    }

    return {
        plots: plots
    }
}

export default connect(mapStateToProps, null)(PlotInspector);

