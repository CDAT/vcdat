/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import PlotTools from '../../../../src/js/components/PlotTools/PlotTools.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

import sinon from 'sinon'


describe('PlotToolsTest.jsx', function() {
    it('renders without exploding', () => {
        const store = createMockStore({
            present: {
                sheets_model: {
                    selected_cell_id: "-1_-1_-1"
                }
            }
        })
        const plot_tools = shallow(<PlotTools store={store}/>).dive() // dive gets us the component instead of the redux wrapper
        expect(plot_tools).to.have.lengthOf(1);
    });
});