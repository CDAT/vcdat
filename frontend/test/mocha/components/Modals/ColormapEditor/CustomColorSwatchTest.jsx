/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import CustomColorSwatch from '../../../../../src/js/components/modals/ColormapEditor/CustomColorSwatch.jsx'
import { shallow } from 'enzyme'


const custom_color_swatch = shallow(<CustomColorSwatch/>)

describe('CustomColorSwatchTest.jsx', function() {
    it('renders without exploding', () => {
        expect(custom_color_swatch).to.have.lengthOf(1);
    });
});