/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColorPicker from '../../../../../src/js/components/modals/ColormapEditor/ColorPicker.jsx'
import { shallow } from 'enzyme'


const colormap_picker = shallow(<ColorPicker/>)

describe('ColorPickerTest.jsx', function() {
    it('renders without exploding', () => {
        expect(colormap_picker).to.have.lengthOf(1);
    });
});