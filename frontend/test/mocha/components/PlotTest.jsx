/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect
import React from 'react'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import Plot from '../../../src/js/components/Plot.jsx'

const Unwrapped_Plot = Plot.DecoratedComponent
const empty_props = {
    plot: {
        variables: [],
        graphics_method_parent: ''
    }
}
const vector_props = {
    plot: {
        variables: [
            "first_variable_name",
            "second_variable_name"
        ],
        graphics_method_parent: 'vector'
    }
}
const scalar_props = {
    plot: {
        variables: ["test_variable_name"],
        graphics_method_parent: 'scalar'
    }
}
const dummyFunction = function (el) { return el; };

describe('PlotTest.jsx', function() {
    it('renders without exploding', function() {
        var plot = shallow(<Unwrapped_Plot {...empty_props} connectDropTarget={dummyFunction}/>)
        expect(plot).to.have.lengthOf(1);
        expect(plot.find(".plot-var.first-var").text()).to.equal("")
    });
    it('renders with a scalar variable', function() {
        var plot = shallow(<Unwrapped_Plot {...scalar_props} connectDropTarget={dummyFunction}/>)
        expect(plot).to.have.lengthOf(1);
        expect(plot.find(".plot-var.first-var")).to.have.lengthOf(1)
        expect(plot.find(".plot-var.first-var").text()).to.equal(scalar_props.plot.variables[0])
    });
    it('renders with a vector variable', function() {
        var plot = shallow(<Unwrapped_Plot {...vector_props} connectDropTarget={dummyFunction}/>)
        expect(plot).to.have.lengthOf(1);
        expect(plot.find(".plot-var.first-var")).to.have.lengthOf(1)
        expect(plot.find(".plot-var.first-var").text()).to.equal(vector_props.plot.variables[0])
        expect(plot.find(".plot-var.second-var.colored-second-var")).to.have.lengthOf(1)
        expect(plot.find(".plot-var.second-var.colored-second-var").text())
        .to.equal(vector_props.plot.variables[1])
    });
    it('Validates a second variable correctly', function() {
        var plot = shallow(<Unwrapped_Plot {...vector_props} connectDropTarget={dummyFunction}/>)
        let mock = {
            draggable: {
                attr: function(){
                    return 'variable'
                }
            }
        }
        let result = plot.instance().validSecondVar({}, mock)
        expect(result).to.be.true
        plot = shallow(<Unwrapped_Plot {...scalar_props} connectDropTarget={dummyFunction}/>)
        result = plot.instance().validSecondVar({}, mock)
        expect(result).to.be.false
    });
});