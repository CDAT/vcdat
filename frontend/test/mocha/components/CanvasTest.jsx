/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
import { Canvas } from '../../../src/js/components/CanvasTest.jsx';
import { shallow } from 'enzyme'


describe('CanvasTest.jsx', function() {
    it('renders without exploding', function() {
        const canvas = shallow(<Canvas/>)
        expect(canvas).to.have.lengthOf(1);
    });
});
