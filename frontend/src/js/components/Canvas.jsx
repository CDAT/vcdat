import React, { Component } from 'react';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js'
import PubSubEvents from '../constants/PubSubEvents.js'
import _ from 'lodash';
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'

class Canvas extends Component{
    constructor(props){
        super(props)
    }

    shouldComponentUpdate(next_props){
        try{
            if(this.props.onTop !== next_props.onTop){
                // onTop will change to false if the user drags a var/gm/temp over the cell. 
                // We need to render so that the class will change to 'cell-stack-bottom'
                return true
            }
            if(next_props.can_plot && next_props.onTop && JSON.stringify(this.props) !== JSON.stringify(next_props)){
                // We need to check for several cases here
                // 1. we must be able to plot
                // 2. There is no point in rendering a plot if it is hidden under the plotter
                // 3. Any prop needs to be different. 
                //      i.e. Dont render the same exact plot just because the parent component rendered. Make sure something changed
                return true
            }
        }
        catch(e){
            console.error(e)
        }
        return false
    }

    componentDidMount() {
        try{
            this.canvas = vcs.init(this.div);
            this.resize_token = PubSub.subscribe(PubSubEvents.resize, this.resetCanvas.bind(this))
            this.colormap_token = PubSub.subscribe(PubSubEvents.colormap_update, this.handleColormapUpdate.bind(this))
        }
        catch(e){
            if(e instanceof ReferenceError && e.message == "vcs is not defined"){
                toast.error("VCS is not defined. Try setting the VCSJS_PORT environment variable and restart vCDAT", 
                    { position: toast.POSITION.BOTTOM_CENTER }
                )
            }
            else{
                console.log(e)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.onTop === true && this.props.onTop === false){
            // Prevents the plot from rendering again when it is actually being hidden
            // We also show the spinner here. This prevents a flicker effect when dragging a var/gm/temp into a cell and back out
            // The incorrect order, and corrected order are shown below
            // plotter -> empty_plot -> spinner -> filled_plot
            // plotter -> spinner -> filled_plot
            this.spinner.className = "canvas-spinner-show"
            return
        }
        this.canvas.clear().then(() => {
            if(this.props.can_plot){
                this.spinner.className = "canvas-spinner-show"
                this.plotAll.call(this)
            }
        })
    }

    async plotAll(){ // eslint complains about async functions right now. Just ignore it.
        for(let [index, plot] of this.props.plots.entries()){
            await this.plot(plot, index)
        }
        this.spinner.className = "canvas-spinner-hidden"
    }

    saveCanvas(name){
        this.div.firstElementChild.toBlob((blob) => {
            FileSaver.saveAs(blob, "pretty_image.png"); // https://github.com/eligrey/FileSaver.js
        })
    }

    plot(plot, index){
        if (plot.variables.length > 0) {
            var variables = this.props.plotVariables[index];
            var dataSpecs = variables.map(function (variable) {
                var dataSpec = {
                    uri: variable.path,
                    variable: variable.cdms_var_name 
                };
                var subRegion = {};
                variable.dimension
                    .filter(dimension => dimension.values)
                    .forEach((dimension) => {
                        subRegion[dimension.axisName] = dimension.values.range;
                    })
                if (!_.isEmpty(subRegion)) {
                    dataSpec['operations'] = [{ subRegion }];
                }

                var axis_order = variable.dimension.map((dimension) => variable.axisList.indexOf(dimension.axisName));
                if (axis_order.some((order, index) => order !== index)) {
                    dataSpec['axis_order'] = axis_order;
                }
                return dataSpec;
            });
            console.log('plotting', dataSpecs, this.props.plotGMs[index], plot.template);
            return this.canvas.plot(dataSpecs, this.props.plotGMs[index], plot.template).then(
                (success)=>{
                    return
                },
                (error) =>{
                    this.canvas.close()
                    delete this.canvas
                    this.canvas = vcs.init(this.div);
                    if(error.data){
                        console.warn("Error while plotting: ", error)
                        toast.error(error.data.exception, {position: toast.POSITION.BOTTOM_CENTER})
                    }
                    else{
                        console.warn("Unknown error while plotting: ", error)
                        toast.error("Error while plotting", {position: toast.POSITION.BOTTOM_CENTER})
                    }
                }
            )
        }
    }
    /* istanbul ignore next */
    componentWillUnmount() {
        this.canvas.close();
    }

    /* istanbul ignore next */
    clearCanvas(){
        this.canvas.clear()
    }

    /* istanbul ignore next */
    resetCanvas(){
        this.canvas.close()
        delete this.canvas
        this.canvas = vcs.init(this.div);
        this.forceUpdate()
    }

    handleColormapUpdate(msg, name){
        let needs_render = false
        for(let plot of this.props.plotGMs){
            if(plot.colormap === name){
                needs_render = true
                break
            }
        }
        if(needs_render){
            this.forceUpdate()
        }
    }

    render() {
        return (
            <div className={this.props.onTop ? "cell-stack-top" : "cell-stack-bottom"}>
                <div ref={(el) => {this.div = el}} id={this.props.row} className="canvas-container"></div>
                <div ref={(el) => {this.spinner = el}} className="canvas-spinner-show">Loading <span className="loading-spinner"></span></div>
            </div>
        )
    }
}
Canvas.propTypes = {
    plots: React.PropTypes.array,
    plotVariables: React.PropTypes.array,
    plotGMs: React.PropTypes.array,
    onTop: React.PropTypes.bool,
    clearCell: React.PropTypes.func,
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    selected_cell_id: React.PropTypes.string,
    cell_id: React.PropTypes.number,
    can_plot: React.PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.can_plot) { // todo: This is old and likely needs to be removed.
        return {
            plotVariables: [],
        }
    }
    // When GMs are loaded, use this function to extract them from the state
    var get_gm_for_plot = (plot) => {
        return state.present.graphics_methods[plot.graphics_method_parent][plot.graphics_method];
    };

    var get_vars_for_plot = (plot) => {
        return plot.variables.map((variable) => {
            return state.present.variables[variable];
        });
    };

    return {
        plotVariables: ownProps.plots.map(get_vars_for_plot),
        plotGMs: ownProps.plots.map(get_gm_for_plot),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Canvas);
