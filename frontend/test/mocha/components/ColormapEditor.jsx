/* globals it, describe, before, beforeEach, */
var dom_mock = require('../dom-mock');
var jsdom = require('mocha-jsdom');
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

import Toolbar from '../../../src/js/components/Toolbar.jsx'
import { shallow } from 'enzyme'

const wrapper = shallow(<Toolbar/>)

describe('toolbarTest.jsx', function() {
    it('renders without exploding', () => {
        expect(wrapper).to.have.lengthOf(1);
    });
});