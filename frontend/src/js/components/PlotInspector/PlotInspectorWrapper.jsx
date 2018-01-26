import React from 'react'
import { connect } from 'react-redux'
import PlotInspector from './PlotInspector.jsx'

class PlotInspectorWrapper extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <table className="plot-inspector-container table table-condensed">
                <thead>
                    <tr>
                        <th scope="col">Delete</th>
                        <th scope="col">Var1</th>
                        <th scope="col">Var2</th>
                        <th scope="col">Graphics Type</th>
                        <th scope="col">Graphics Method</th>
                        <th scope="col">Template</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.plots && this.props.plots.map((plot, index) => {
                            let graphics_methods
                            try{
                                graphics_methods = Object.keys(this.props.all_graphics_methods[plot.graphics_method_parent])
                            }
                            catch(e){
                                console.log("woops: ", e)
                                graphics_methods = []
                            }

                            return(
                                <PlotInspector
                                    key={index}
                                    plot={plot}
                                    variables={this.props.variables}
                                    graphics_method_types={this.props.graphics_method_types}
                                    graphics_methods={graphics_methods}
                                    templates={this.props.templates}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

PlotInspectorWrapper.propTypes = {
    plots: React.PropTypes.array,
    all_graphics_methods: React.PropTypes.object,
    variables: React.PropTypes.array,
    graphics_method_types: React.PropTypes.array,
    templates: React.PropTypes.array,
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
        plots = []
    }
    return {
        plots: plots,
        all_graphics_methods: state.present.graphics_methods,
        variables: state.present.variables ? Object.keys(state.present.variables) : [],
        graphics_method_types: state.present.graphics_methods ? Object.keys(state.present.graphics_methods) : [],
        templates: state.present.templates ? Object.keys(state.present.templates) : [],
    }
}

export default connect(mapStateToProps, null)(PlotInspectorWrapper);

