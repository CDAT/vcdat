/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import ColorPicker from '../../../../../src/js/components/modals/ColormapEditor/ColorPicker.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { mount } from 'enzyme'

const props = {
    color:{
        hex: "#333333",
        hsl: { h: 0, s: 0, l: 0.2, a: 1 },
        hsv: { h: 0, s: 0, v: 0.2, a: 1 },
        rgb: { r: 51, g: 51, b: 51, a: 1 },
    },
    onChange: function(){return true}
}
const colormap_picker = mount(<ColorPicker {...props}/>)

describe('ColorPickerTest.jsx', function() {
    it('renders without exploding', () => {
        expect(colormap_picker).to.have.lengthOf(1);
    });
});