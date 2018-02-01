/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import InspectorToolbar from '../../../../src/js/components/PlotTools/PlotTools.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../../src/js/constants/PubSubEvents.js'

describe('InspectorToolbarTest.jsx', function() {
    it('renders without exploding', () => {
        const inspector_toolbar = shallow(<InspectorToolbar/>)
        expect(inspector_toolbar).to.have.lengthOf(1);
    });

    it('Clear button publishes a clear event', () => {
        const inspector_toolbar = shallow(<InspectorToolbar/>)
        let spy = sinon.spy()
        let clock = sinon.useFakeTimers();
        PubSub.subscribe(PubSubEvents.clear_canvas, spy)
        let clear_button = inspector_toolbar.find('#clear-canvas-button')
        expect(clear_button).to.have.lengthOf(1)
        clear_button.simulate('click')
        clock.tick(1) // publish is async. We manually tick here to make sure it runs before testing
        expect(spy.calledOnce).to.be.true
        clock.restore()
    });

    it('Opens colormap editor', () => {
        const inspector_toolbar = shallow(<InspectorToolbar/>)
        let colormap_button = inspector_toolbar.find('#open-colormap-editor-button')
        expect(colormap_button).to.have.lengthOf(1)
        expect(inspector_toolbar.state().showColormapEditor).to.be.false
        colormap_button.simulate("click")
        expect(inspector_toolbar.state().showColormapEditor).to.be.true
    });
});