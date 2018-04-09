/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')
import PlotInspector from '../../../../src/js/components/PlotInspector/PlotInspector.jsx'
import { ONE_VAR_PLOTS, TWO_VAR_PLOTS } from '../../../../src/js/constants/Constants.js'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

function getProps(){
    return {
        undoEnabled: true,
        redoEnabled: false,
        cell_selected: "0_0_0",
        plots: [
            {
            variables: [],
            graphics_method_parent: "boxfill",
            graphics_method: "default",
            template: "default"
            }
        ],
        cell_row: 0,
        cell_col: 0,
        all_graphics_methods: {
            boxfill: {
                default: {},
                polar:{}
            },
            isofill: {
                default: {}
            },
            isoline: {
                default: {}
            },
            vector: {
                default: {},
            },
            "3d_vector": {
                default: {}
            },
            streamline: {
                default: {}
            },
        },
        variables: ["var1", "var2"],
        graphics_method_types: ONE_VAR_PLOTS.concat(TWO_VAR_PLOTS),
        templates: [
            "ASD",
            "ASD_dud",
            "default",
        ],
        disable_delete: true,
        show_colormap_editor: false,
        handleSelectVar1: sinon.spy(),
        handleSelectVar2: sinon.spy(),
        handleSelectGMType: sinon.spy(),
        handleSelectGM: sinon.spy(),
        handleSelectTemplate: sinon.spy(),
        handleDeletePlot: sinon.spy()
    }
}


describe('PlotInspectorTest.jsx', function() {
    it('Renders without exploding', () => {
        let props = {
            variables: [],
            graphics_method_types: [],
            graphics_methods: [],
            templates: [],
        }
        let wrapper = shallow(<PlotInspector {...props}/>)
        expect(wrapper).to.have.lengthOf(1);

        props = getProps()
        wrapper = shallow(<PlotInspector {...props}/>)
        expect(wrapper).to.have.lengthOf(1);
    });
    
    it('Disables var 2 when single variable plots are selected', () => {
        let props = getProps()
        for(let gm_type_1var of ONE_VAR_PLOTS){
            props.plots[0].graphics_method_parent = gm_type_1var
            const wrapper = shallow(<PlotInspector {...props} />)            
            expect(wrapper.find("#plot-inspector-variable2-select").getElement().props.disabled).to.equal(true)
        }
    });

    it('Enables var 2 when two variable plots are selected', () => {
        let props = getProps()
        for(let gm_type_2var of TWO_VAR_PLOTS){
            props.plots[0].graphics_method_parent = gm_type_2var
            const wrapper = shallow(<PlotInspector {...props} />)
            expect(wrapper.find("#plot-inspector-variable2-select").getElement().props.disabled).to.equal(false)
        }
    });

    it('Var1 select calls onChange handler', () => {
        let props = getProps()
        let wrapper = mount(<PlotInspector {...props}/>)
        let select = wrapper.find("#plot-inspector-variable1-select")
        select.simulate("change", {target: { value : 'var1'}})
        expect(props.handleSelectVar1.calledWith('var1')).to.be.true
    })

    it('Var2 select calls onChange handler', () => {
        const props = getProps()
        const wrapper = mount(<PlotInspector {...props}/>)
        props.plots[0].graphics_method_parent = "vector"
        const select = wrapper.find("#plot-inspector-variable2-select")
        select.simulate("change", {target: { value : 'var2'}})
        expect(props.handleSelectVar2.calledWith('var2')).to.be.true
    })

    it('GM_Type select calls onChange handler', () => {
        const props = getProps()
        const wrapper = mount(<PlotInspector {...props}/>)
        const select = wrapper.find("#plot-inspector-graphics-method-type-select")
        select.simulate("change", {target: { value : "boxfill"}})
        expect(props.handleSelectGMType.calledWith("boxfill")).to.be.true
    })

    it('GM select calls onChange handler', () => {
        const props = getProps()
        const wrapper = mount(<PlotInspector {...props}/>)
        const select = wrapper.find("#plot-inspector-graphics-method-select")
        select.simulate("change", {target: { value : 'polar'}})
        expect(props.handleSelectGM.calledWith('boxfill', 'polar')).to.be.true
    })

    it('Template select calls onChange handler', () => {
        const props = getProps()
        const wrapper = mount(<PlotInspector {...props}/>)
        const select = wrapper.find("#plot-inspector-template-select")
        select.simulate("change", {target: { value : 'ASD_dud'}})
        expect(props.handleSelectTemplate.calledWith('ASD_dud')).to.be.true
    });

    it('Handles clicking delete plot button', () => {
        const props = getProps()
        let wrapper = shallow(<PlotInspector {...props}/>)
        wrapper.find("#delete-plot-button").simulate("click")
        expect(props.handleDeletePlot.callCount).to.equal(1); // shallow ignores the fact that the button is disabled. Convenient for us :)
    });

    it('Calls prop to handle adding plots', () => {
        let props = getProps()
        let addPlot = sinon.spy()
        let wrapper = shallow(<PlotInspector {...props} handleAddPlot={addPlot}/>)
        wrapper.find("#add-plot-button").simulate("click")
        expect(addPlot.callCount).to.equal(1)
    });
});
