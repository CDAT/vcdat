/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import InputFields from '../../../../../src/js/components/modals/ColormapEditor/InputFields.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'

var stub = sinon.stub()
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
    hex: "#333333",
    onChange: stub
}
const input_fields = shallow(<InputFields {...props}/>) // has required props, remember to pass them

describe('InputFieldsTest.jsx', function() {
    it('renders without exploding', () => {
        expect(input_fields).to.have.lengthOf(1);
    });
    it('Handles hue change', () => {
        let hue = {Hue: 281}
        input_fields.find("EditableInput.input-box-Hue").simulate("change", hue)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({h: hue.Hue, s: 0, v: 201, source: "hsv"}))
        stub.reset()
    });
    it('Handles saturation change', () => {
        let sat = {Saturation: 1}
        input_fields.find("EditableInput.input-box-Saturation").simulate("change", sat)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({h: 280, s: sat.Saturation, v: 201, source: "hsv"}))
        stub.reset()
    });
    it('Handles value change', () => {
        let val = {Value: 202}
        input_fields.find("EditableInput.input-box-Value").simulate("change", val)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({h: 280, s: 0, v: val.Value, source: "hsv"}))
        stub.reset()
    });
    it('Handles hex change', () => {
        let hex = {Hex: "#444444"}
        input_fields.find("EditableInput.input-box-Hex").simulate("change", hex)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({hex: hex.Hex, source: "hex"}))
        stub.reset()
    });
    it('Handles red change', () => {
        let red = {Red: 52}
        input_fields.find("EditableInput.input-box-Red").simulate("change", red)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({r: red.Red, g: 51, b: 51, source: "rgb"}))
        stub.reset()
    });
    it('Handles green change', () => {
        let green = {Green: 52}
        input_fields.find("EditableInput.input-box-Red").simulate("change", green)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({r: 51, g: green.Green, b: 51, source: "rgb"}))
        stub.reset()
    });
    it('Handles blue change', () => {
        let blue = {Blue: 52}
        input_fields.find("EditableInput.input-box-Red").simulate("change", blue)
        sinon.assert.calledOnce(stub)
        sinon.assert.calledWith(stub, sinon.match({r: 51, g: 51, b: blue.Blue, source: "rgb"}))
        stub.reset()
    });
});