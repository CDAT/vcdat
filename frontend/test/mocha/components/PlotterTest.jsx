/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
import React from 'react'
import { shallow } from 'enzyme'
import Plotter from '../../../src/js/components/Plotter.jsx'

const props = {
    cell:{
        plots: [
            {}
        ]
    },
    row: 0,
    col: 0,
    onHover: function(){},
    onDrop: function(){},
    swapVariableInPlot: function(){},
    swapGraphicsMethodInPlot: function(){},
    swapTemplateInPlot: function(){},
}
describe('PlotterTest.jsx', function() {
    it('renders without exploding', function() {
        const plotter = shallow(<Plotter {...props}/>)
        expect(plotter).to.have.lengthOf(1);
    });
    it('renders different className based on prop', function() {
        var plotter = shallow(<Plotter {...props} onTop={true}/>)
        expect(plotter.find(".cell-stack-top.plotter")).to.have.lengthOf(1);
        plotter = shallow(<Plotter {...props} onTop={false}/>)
        expect(plotter.find(".cell-stack-bottom.plotter")).to.have.lengthOf(1);
    });
});