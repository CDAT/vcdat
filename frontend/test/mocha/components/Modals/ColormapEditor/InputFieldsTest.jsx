/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import InputFields from '../../../../../src/js/components/modals/ColormapEditor/InputFields.jsx'
import { shallow } from 'enzyme'


const input_fields = shallow(<InputFields/>)

describe('InputFieldsTest.jsx', function() {
    it('renders without exploding', () => {
        expect(input_fields).to.have.lengthOf(1);
    });
});