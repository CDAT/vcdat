/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
import PlotInspector from '../../../../src/js/components/PlotInspector/PlotInspector.jsx'
import { ONE_VAR_PLOTS, TWO_VAR_PLOTS } from '../../../../src/js/constants/Constants.js'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

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

        props = {
            variables: ["dummy_var"],
            graphics_method_types: ["dummy_type"],
            graphics_methods: ["dummy_method"],
            templates: ["dummy_template"],
        }
        wrapper = shallow(<PlotInspector {...props}/>)
        expect(wrapper).to.have.lengthOf(1);
    });
    
    it('Disables var 2 when single variable plots are selected', () => {
        let props = {
            variables: ["clt"],
            graphics_method_types: ONE_VAR_PLOTS,
            graphics_methods: ["default"],
            templates: ["default"],
        }
        for(let gm_type of ONE_VAR_PLOTS){
            const wrapper = shallow(<PlotInspector {...props} cur_gm_type={gm_type}/>)
            expect(wrapper.find("#plot-inspector-variable2-select").getNode().props.disabled).to.equal(true)
        }

        props = {
            variables: ["clt"],
            graphics_method_types: TWO_VAR_PLOTS,
            graphics_methods: ["default"],
            templates: ["default"],
        }
        for(let gm_type of TWO_VAR_PLOTS){
            const wrapper = shallow(<PlotInspector {...props} cur_gm_type={gm_type}/>)
            expect(wrapper.find("#plot-inspector-variable2-select").getNode().props.disabled).to.equal(false)
        }
    });

    it('Selects call their onChange handler', () => {
        const props = {
            variables: ["var1", "var2"],
            graphics_method_types: TWO_VAR_PLOTS,
            graphics_methods: ["dummy", "gm"],
            templates: ["dummy", "template"],
            handleSelectVar1: sinon.spy(),
            handleSelectVar2: sinon.spy(),
            handleSelectGMType: sinon.spy(),
            handleSelectGM: sinon.spy(),
            handleSelectTemplate: sinon.spy(),
        }
        const wrapper = mount(<PlotInspector {...props}/>)

        let select = wrapper.find("#plot-inspector-variable1-select")
        select.simulate("change", {target: { value : 'var1'}})
        expect(props.handleSelectVar1.calledWith('var1')).to.be.true

        select = wrapper.find("#plot-inspector-variable2-select")
        select.simulate("change", {target: { value : 'var2'}})
        expect(props.handleSelectVar2.calledWith('var2')).to.be.true

        select = wrapper.find("#plot-inspector-graphics-method-select")
        select.simulate("change", {target: { value : 'gm'}})
        expect(props.handleSelectGM.calledWith(wrapper.props().cur_gm_type, 'gm')).to.be.true

        select = wrapper.find("#plot-inspector-graphics-method-type-select")
        select.simulate("change", {target: { value : TWO_VAR_PLOTS[1]}})
        expect(props.handleSelectGMType.calledWith(TWO_VAR_PLOTS[1])).to.be.true

        select = wrapper.find("#plot-inspector-template-select")
        select.simulate("change", {target: { value : 'template'}})
        expect(props.handleSelectTemplate.calledWith('template')).to.be.true
    });

    it('Handles clicking delete plot button', () => {
        let props = {
            variables: [],
            graphics_method_types: [],
            graphics_methods: [],
            templates: [],
            handleDeletePlot: sinon.spy()
        }
        let wrapper = shallow(<PlotInspector {...props}/>)
        wrapper.find("#delete-plot-button").simulate("click")
        expect(props.handleDeletePlot.callCount).to.equal(1);
    });
});
