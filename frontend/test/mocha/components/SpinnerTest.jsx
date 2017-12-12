// Mocking window and document object:
/* globals it, describe, beforeEach */
var chai = require('chai');
var expect = chai.expect
var React = require('react');
var Spinner = require('../../../src/js/components/Spinner/Spinner.jsx').default;
import { shallow } from 'enzyme'

describe('SpinnerTest.jsx', function() {
    it('renders without exploding', function() {
        var mockUpdate = ()=>{};
        var mockValue = 10;
        var spinner = shallow(
            <Spinner min='1' max='4' value={mockValue} update={mockUpdate} />
        );
        expect(spinner).to.have.lengthOf(1);
    });
});
