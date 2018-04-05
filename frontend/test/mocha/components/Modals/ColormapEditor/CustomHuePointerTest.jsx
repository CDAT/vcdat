/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import CustomHuePointer from '../../../../../src/js/components/modals/ColormapEditor/CustomHuePointer.jsx'
import { shallow } from 'enzyme'


const custom_hue_pointer = shallow(<CustomHuePointer/>)

describe('CustomHuePointerTest.jsx', function() {
    it('renders without exploding', () => {
        expect(custom_hue_pointer).to.have.lengthOf(1);
    });
});