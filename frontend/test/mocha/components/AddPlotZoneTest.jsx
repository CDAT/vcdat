/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react') // needed to use jsx
import { shallow } from 'enzyme'
import sinon from 'sinon'
import AddPlotZone, { addPlotTarget } from '../../../../frontend/src/js/components/AddPlotZone.jsx'
import DragAndDropTypes from '../../../src/js/constants/DragAndDropTypes';


var UnwrappedAddPlotZone = AddPlotZone.DecoratedComponent

describe('PlotToolsTest.jsx', function() {
    it('renders without exploding', () => {
        const dummyFunction = el => el // return whatever we are given
        const add_plot_zone = shallow(<UnwrappedAddPlotZone connectDropTarget={dummyFunction}/>)
        expect(add_plot_zone).to.have.lengthOf(1);
    });

    it('Drop works with GM', () => {
        const props = {
            onDrop: sinon.spy(),
            addPlot: sinon.spy(),
            row: 0,
            col: 0,
        }
        let monitor = {
            getItemType: sinon.stub().returns(DragAndDropTypes.GM),
            getItem: ()=>{return {gmType: "gmtype", gmName:"gmname"}},
        }
        const component = {
            setState: sinon.spy(),
        }
        addPlotTarget.drop(props, monitor, component)
        expect(props.onDrop.calledOnce).to.be.true
        expect(props.addPlot.calledOnce).to.be.true
        expect(props.addPlot.getCall(0).args[0]).to.equal(null) // variable
        expect(props.addPlot.getCall(0).args[1]).to.equal("gmtype") // graphics_method_parent
        expect(props.addPlot.getCall(0).args[2]).to.equal("gmname") // graphics_method
        expect(props.addPlot.getCall(0).args[3]).to.equal(null) // template
        expect(props.addPlot.getCall(0).args[4]).to.equal(0) // row
        expect(props.addPlot.getCall(0).args[5]).to.equal(0) // col
        expect(component.setState.calledOnce).to.be.true
    });

    it('Drop works with VAR', () => {
        const props = {
            onDrop: sinon.spy(),
            addPlot: sinon.spy(),
            row: 1,
            col: 1,
        }
        let monitor = {
            getItemType: sinon.stub().returns(DragAndDropTypes.VAR),
            getItem: ()=>{return {variable: "varname"}},
        }
        const component = {
            setState: sinon.spy(),
        }
        addPlotTarget.drop(props, monitor, component)
        expect(props.onDrop.calledOnce).to.be.true
        expect(props.addPlot.calledOnce).to.be.true
        expect(props.addPlot.getCall(0).args[0]).to.equal("varname") // variable
        expect(props.addPlot.getCall(0).args[1]).to.equal(null) // graphics_method_parent
        expect(props.addPlot.getCall(0).args[2]).to.equal(null) // graphics_method
        expect(props.addPlot.getCall(0).args[3]).to.equal(null) // template
        expect(props.addPlot.getCall(0).args[4]).to.equal(1) // row
        expect(props.addPlot.getCall(0).args[5]).to.equal(1) // col
        expect(component.setState.calledOnce).to.be.true
    });

    it('Drop works with TMPL', () => {
        const props = {
            onDrop: sinon.spy(),
            addPlot: sinon.spy(),
            row: 2,
            col: 2,
        }
        let monitor = {
            getItemType: sinon.stub().returns(DragAndDropTypes.TMPL),
            getItem: ()=>{return {template: "template"}},
        }
        const component = {
            setState: sinon.spy(),
        }
        addPlotTarget.drop(props, monitor, component)
        expect(props.onDrop.calledOnce).to.be.true
        expect(props.addPlot.calledOnce).to.be.true
        expect(props.addPlot.getCall(0).args[0]).to.equal(null) // variable
        expect(props.addPlot.getCall(0).args[1]).to.equal(null) // graphics_method_parent
        expect(props.addPlot.getCall(0).args[2]).to.equal(null) // graphics_method
        expect(props.addPlot.getCall(0).args[3]).to.equal("template") // template
        expect(props.addPlot.getCall(0).args[4]).to.equal(2) // row
        expect(props.addPlot.getCall(0).args[5]).to.equal(2) // col
        expect(component.setState.calledOnce).to.be.true
    });

    it('Hover works', () => {
        const component = {
            setState: sinon.spy()
        }
        addPlotTarget.hover(null, null, component)
        expect(component.setState.calledOnce).to.be.true
        expect(component.setState.getCall(0).args)
    });

    it('Click calls addPlot', () => {
        const dummyFunction = el => el
        const addPlot = sinon.spy()
        const add_plot_zone = shallow(<UnwrappedAddPlotZone connectDropTarget={dummyFunction} addPlot={addPlot} row={0} col={0}/>)
        add_plot_zone.find("svg").simulate("click")
        expect(addPlot.calledOnce).to.be.true
        expect(addPlot.getCall(0).args[0]).to.equal(null)
        expect(addPlot.getCall(0).args[1]).to.equal(null)
        expect(addPlot.getCall(0).args[2]).to.equal(null)
        expect(addPlot.getCall(0).args[3]).to.equal(null)
        expect(addPlot.getCall(0).args[4]).to.equal(0)
        expect(addPlot.getCall(0).args[5]).to.equal(0)
    });
});