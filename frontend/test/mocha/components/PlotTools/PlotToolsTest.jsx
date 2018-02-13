/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import PlotTools from '../../../../src/js/components/PlotTools/PlotTools.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import { toast } from 'react-toastify'
import sinon from 'sinon'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../../src/js/constants/PubSubEvents.js'

describe('PlotToolsTest.jsx', function() {
    it('renders without exploding', () => {
        const store = createMockStore({
            present: {
                sheets_model: {
                    selected_cell_id: "none"
                }
            }
        })
        const plot_tools = shallow(<PlotTools store={store}/>).dive() // dive gets us the component instead of the redux wrapper
        expect(plot_tools).to.have.lengthOf(1);
    });

    it('Clear button publishes a clear event', () => {
        const store = createMockStore({
            present: {
                sheets_model: {
                    selected_cell_id: "0_0_0"
                }
            }
        })
        const plot_tools = shallow(<PlotTools store={store}/>).dive()
        let spy = sinon.spy()
        let clock = sinon.useFakeTimers();
        PubSub.subscribe(PubSubEvents.clear_canvas, spy)
        let clear_button = plot_tools.find('#clear-canvas-button')
        expect(clear_button).to.have.lengthOf(1)
        clear_button.simulate('click')
        clock.tick(1) // publish is async. We manually tick here to make sure it runs before testing
        expect(spy.calledOnce).to.be.true
        clock.restore()
    });

    it('Clear button toasts when a cell is not selected', () => {
        // clear should not be called if no cells are selected
        const store = createMockStore({
            present: {
                sheets_model: {
                    selected_cell_id: "none"
                }
            }
        })
        const plot_tools = shallow(<PlotTools store={store}/>).dive()
        let clock = sinon.useFakeTimers();
        sinon.stub(toast, "info")
        let clear_spy = sinon.spy()
        PubSub.subscribe(PubSubEvents.clear_canvas, clear_spy)
        let clear_button = plot_tools.find('#clear-canvas-button')
        expect(clear_button).to.have.lengthOf(1)
        clear_button.simulate('click')
        clock.tick(1) // publish is async. We manually tick here to make sure it runs before testing
        expect(toast.info.calledOnce).to.be.true
        expect(clear_spy.calledOnce).to.be.false
        clock.restore()
    });

    it('Opens colormap editor', () => {
        const store = createMockStore({
            present: {
                sheets_model: {
                    selected_cell_id: "none"
                }
            }
        })
        const plot_tools = shallow(<PlotTools store={store}/>).dive()
        let colormap_button = plot_tools.find('#open-colormap-editor-button')
        expect(colormap_button).to.have.lengthOf(1)
        expect(plot_tools.state().showColormapEditor).to.be.false
        colormap_button.simulate("click")
        expect(plot_tools.state().showColormapEditor).to.be.true
    });
});