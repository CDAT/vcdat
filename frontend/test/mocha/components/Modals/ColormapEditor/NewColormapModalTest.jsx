/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import NewColormapModal from '../../../../../src/js/components/modals/ColormapEditor/NewColormapModal.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'


describe('NewColormapModalTest.jsx', function() {
    it('renders without exploding', () => {
        const new_colormap_modal = shallow(<NewColormapModal/>)
        expect(new_colormap_modal).to.have.lengthOf(1)
    });

    it('Calls close prop on cancel', () => {
        let close_prop = sinon.spy()
        let new_colormap_modal = shallow(<NewColormapModal close={close_prop}/>)
        new_colormap_modal.find("button.cancel").simulate("click")
        expect(close_prop.calledOnce).to.be.true
    });

    it('Calls newColormap prop on create', () => {
        let create_prop = sinon.spy()
        let new_colormap_modal = shallow(<NewColormapModal newColormap={create_prop}/>)
        new_colormap_modal.setState({name: "test-name"})
        new_colormap_modal.find("button.create").simulate("click")
        expect(create_prop.calledWith("test-name")).to.be.true
    });

    it('Sets name state on input change', () => {
        let new_colormap_modal = shallow(<NewColormapModal/>)
        let event = {
            target: {
                value: "test"
            }
        }
        new_colormap_modal.find("input.name-input").simulate("change", event)
        expect(new_colormap_modal.state().name).to.equal("test")
    });

});