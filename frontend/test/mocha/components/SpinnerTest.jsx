// Mocking window and document object:
/* globals it, describe, beforeEach */
var chai = require('chai');
var expect = chai.expect
var React = require('react');
var Spinner = require('../../../src/js/components/Spinner/Spinner.jsx').default;
import { shallow } from 'enzyme'
import sinon from 'sinon'

describe('SpinnerTest.jsx', function() {
    it('renders without exploding', function() {
        let stub = sinon.stub() // a fake update function
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        expect(spinner).to.have.lengthOf(1);
    });
    it('Increments correctly', function() {
        let stub = sinon.stub()
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        spinner.instance().incrementValue()
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, mock_value + 1)
    });
    it('Decrements correctly', function() {
        let stub = sinon.stub()
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        spinner.instance().decrementValue()
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, mock_value - 1)
    });
    it('Does not increment past max', function() {
        let stub = sinon.stub()
        let mock_value = 4
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        spinner.instance().incrementValue()
        sinon.assert.notCalled(stub)
    });
    it('Does not decrement past min', function() {
        let stub = sinon.stub()
        let mock_value = 1
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        spinner.instance().decrementValue()
        sinon.assert.notCalled(stub)
    });
    it('Handles change correctly', function() {
        let stub = sinon.stub()
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        let event = {
            target: {
                value: 4
            }
        }
        spinner.find("InputGroup FormControl").simulate("change", event)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, event.target.value)
    });
    it('Handles user entering a number higher than max correctly', function() {
        let stub = sinon.stub()
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        let event = {
            target: {
                value: 9
            }
        }
        spinner.find("InputGroup FormControl").simulate("change", event)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, 4)
    });
    it('Handles user entering a number lower than min correctly', function() {
        let stub = sinon.stub()
        let mock_value = 3
        let spinner = shallow(
            <Spinner min={1} max={4} value={mock_value} update={stub} />
        );
        let event = {
            target: {
                value: 0
            }
        }
        spinner.find("InputGroup FormControl").simulate("change", event)
        sinon.assert.calledOnce(stub)
        debugger
        sinon.assert.calledWith(stub, 1)
    });
});
