/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import CustomColorSwatch from '../../../../../src/js/components/modals/ColormapEditor/CustomColorSwatch.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'

const spy = sinon.spy()
const props = {
    hex: "#333333",
    onChange: spy
}
const custom_color_swatch = shallow(<CustomColorSwatch {...props}/>)

describe('CustomColorSwatchTest.jsx', function() {
    it('renders without exploding', () => {
        expect(custom_color_swatch).to.have.lengthOf(1)
    });
    it('Adds Custom Colors correctly', () => {
        let index = custom_color_swatch.state().currentCell
        custom_color_swatch.instance().addCustomColor()
        expect(custom_color_swatch.state().colors[index]).to.equal("#333333")
    });
    it('Handles clicks correctly', () => {
        let index = 3
        let hex = "#444444"
        expect(custom_color_swatch.state().currentCell).to.not.equal(index)
        custom_color_swatch.instance().handleClick(hex, index)
        expect(custom_color_swatch.state().currentCell).to.equal(index)
        sinon.assert.calledWith(spy,hex)
    });
});