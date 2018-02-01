/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
import { PurePlotInspectorWrapper as PlotInspectorWrapper } from '../../../../src/js/components/PlotInspector/PlotInspectorWrapper.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'

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
    
});
