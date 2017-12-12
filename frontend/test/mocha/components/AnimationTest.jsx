/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
var Animation= require('../../../src/js/components/Animation.jsx').default;
import { shallow } from 'enzyme'


describe('AnimationTest.jsx', function() {
    it('renders without exploding', function() {
        const animation = shallow(<Animation/>)
        expect(animation).to.have.lengthOf(1);
    });
});
