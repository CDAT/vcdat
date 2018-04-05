/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')
import { PurePlotInspectorWrapper as PlotInspectorWrapper,
         mapStateToProps } from '../../../../src/js/components/PlotInspector/PlotInspectorWrapper.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../../src/js/constants/PubSubEvents.js'
import { toast } from 'react-toastify'

const cell_row = 0
const cell_col = 0
const plot_index = 0

function getProps() {
    return {
        plots: [{
            variables: [],
            graphics_method_parent: "boxfill",
            graphics_method: "default",
            template: "default"
            }
        ],
        cell_selected: "0_0_0",
        cell_row: cell_row,
        cell_col: cell_col,
        all_graphics_methods: {
            boxfill: {
                "default": {},
                "polar": {},
                "quick": {},
            },
            vector: {
                "default": {}
            },
            isofill: {
                "polar": {}
            }
        },
        "variables": ["clt"],
        "graphics_method_types": [
        "isoline",
        "boxfill",
        "isofill",
        "vector",
        ],
        "templates": [
        "default",
        "quick"
        ],
        swapGraphicsMethodInPlot: sinon.spy(),
        swapVariableInPlot: sinon.spy(),
        swapTemplateInPlot: sinon.spy(),
        deleteVariableInPlot: sinon.spy(),
    }
}

describe('PlotInspectorWrapperTest.jsx', function() {
    it('Renders without exploding', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        expect(wrapper).to.have.lengthOf(1);
    });

    it('Handles selecting variable 1', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        wrapper.instance().handleSelectVar1("clt", plot_index)
        expect(props.swapVariableInPlot.calledWith(cell_row, cell_col, "clt", plot_index, 0)).to.be.true
    });

    it('Handles selecting variable 2', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        wrapper.instance().handleSelectVar2("clt", plot_index)
        expect(props.swapVariableInPlot.calledWith(cell_row, cell_col, "clt", plot_index, 1)).to.be.true

        wrapper.instance().handleSelectVar2("", 0)
        expect(props.deleteVariableInPlot.calledWith(cell_row, cell_col, plot_index, 1)).to.be.true
    });

    it('Handles selecting graphics method type', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        
        wrapper.instance().handleSelectGMType("vector", plot_index)
        expect(props.swapGraphicsMethodInPlot.calledWith(cell_row, cell_col, "vector", "default", plot_index)).to.be.true

        wrapper.instance().handleSelectGMType("isofill", plot_index)
        // if there is no default the first item should be chosen
        expect(props.swapGraphicsMethodInPlot.calledWith(cell_row, cell_col, "isofill", "polar", plot_index)).to.be.true
    });
    
    it('Handles selecting a graphics method', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        
        wrapper.instance().handleSelectGM("boxfill", "quick", plot_index)
        expect(props.swapGraphicsMethodInPlot.calledWith(cell_row, cell_col, "boxfill", "quick", plot_index)).to.be.true
    });
    
    it('Handles selecting a template', () => {
        let props = getProps()
        let wrapper = shallow(<PlotInspectorWrapper {...props}/>)

        wrapper.instance().handleSelectTemplate("default", plot_index)
        expect(props.swapTemplateInPlot.calledWith(cell_row, cell_col, "default", plot_index)).to.be.true
    });

    it('Handles adding a plot', () => {
        let props = getProps()
        let addPlot = sinon.spy()
        let wrapper = shallow(<PlotInspectorWrapper {...props} addPlot={addPlot}/>)

        wrapper.instance().handleAddPlot()
        expect(addPlot.callCount).to.equal(1)
        expect(addPlot.calledWith(null, null, null, null, 0, 0))
    });
    
    it('Calls prop to handle deleting plots', () => {
        let props = getProps()
        let deletePlot = sinon.spy()
        let wrapper = shallow(<PlotInspectorWrapper {...props} deletePlot={deletePlot}/>)

        wrapper.instance().handleDeletePlot()
        expect(deletePlot.callCount).to.equal(1)
    });

    it('handleClearCell publishes a clear event', () => {
        const props = getProps()
        const wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        let spy = sinon.spy()
        let clock = sinon.useFakeTimers();
        PubSub.subscribe(PubSubEvents.clear_canvas, spy)
        wrapper.instance().handleClearCell()
        clock.tick(1) // publish is async. We manually tick here to make sure it runs before testing
        expect(spy.calledOnce).to.be.true
        clock.restore()
    });

    it('Clear button toasts when a cell is not selected', () => {
        // clear should not be called if no cells are selected
        let props = getProps()
        props.cell_selected = "-1_-1_-1"
        const wrapper = shallow(<PlotInspectorWrapper {...props}/>)
        let clock = sinon.useFakeTimers();
        sinon.stub(toast, "info")
        let spy = sinon.spy()
        PubSub.subscribe(PubSubEvents.clear_canvas, spy)
        wrapper.instance().handleClearCell()
        clock.tick(1) // publish is async. We manually tick here to make sure it runs before testing
        expect(toast.info.calledOnce).to.be.true
        expect(spy.calledOnce).to.be.false
        clock.restore()
    });

    it('Colormap editor opens and closes', () => {
        const props = getProps()
        const wrapper = shallow(<PlotInspectorWrapper {...props} />)
        expect(wrapper.instance().state.show_colormap_editor).to.be.false
        wrapper.instance().handleOpenColormapEditor()
        expect(wrapper.instance().state.show_colormap_editor).to.be.true
        wrapper.instance().handleCloseColormapEditor()
        expect(wrapper.instance().state.show_colormap_editor).to.be.false
    });

    it('Maps state to props with a cell selected', () => {
        const plot_value = {
            variables: [],
            graphics_method_parent: "boxfill",
            graphics_method: "default",
            template: "default"
        }
        const state = {
            present:{
                graphics_methods: {
                    boxfill: {
                        default:{}
                    },
                    isofill: {
                        default:{}
                    }
                },
                variables: {
                    clt: {},
                },
                templates: {
                    default: {},
                    quick: {}
                },
                sheets_model: {
                    selected_cell_id: "0_0_0",
                    sheets: [{
                        name: "Sheet",
                        col_count: 1,
                        row_count: 1,
                        selected_cell_indices: [
                            [-1, -1]
                        ],
                        cells: [
                            [{
                                plot_being_edited: 0,
                                plots: [
                                    plot_value
                                ]
                            }]
                        ],
                        sheet_index: 0
                    }]
                }
            }
        }
        
        const obj = mapStateToProps(state)
        expect(obj.all_graphics_methods).to.deep.equal({
            boxfill: {default:{}},
            isofill: {default:{}}
        })
        expect(obj.cell_row).to.equal(0)
        expect(obj.cell_col).to.equal(0)
        expect(obj.cell_selected).to.equal("0_0_0")
        expect(obj.graphics_method_types).to.deep.equal(["boxfill", "isofill"])
        expect(obj.plots[0]).to.deep.equal(plot_value)
        expect(obj.templates).to.deep.equal(["default", "quick"])
        expect(obj.variables).to.deep.equal(["clt"])
    });
});
