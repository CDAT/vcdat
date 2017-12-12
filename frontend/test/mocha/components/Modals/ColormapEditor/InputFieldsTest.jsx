/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import InputFields from '../../../../../src/js/components/modals/ColormapEditor/InputFields.jsx'
import { shallow } from 'enzyme'

var props = {
    hsv: {
        h: 280,
        s: 0,
        v: 201
    },
    rgb: {
        r: 51,
        g: 51,
        b: 51
    },
    hex: "#333333"
}
const input_fields = shallow(<InputFields {...props}/>) // has required props, remember to pass them

describe('InputFieldsTest.jsx', function() {
    it('renders without exploding', () => {
        expect(input_fields).to.have.lengthOf(1);
    });
});