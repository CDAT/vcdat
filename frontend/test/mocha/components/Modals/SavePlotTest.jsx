/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import SavePlot from '../../../../src/js/components/modals/SavePlot/SavePlot.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

describe('SavePlotTest.jsx', function() {
    it('renders without exploding', () => {
        const store_with_no_selected_cell = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "-1_-1_-1"
                }
            }
        })
        const store_with_selected_cell = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "0_0_0"
                }
            }
        })
        var save_plot = shallow(<SavePlot store={store_with_no_selected_cell}/>).dive()
        expect(save_plot).to.have.lengthOf(1)
        
        save_plot = shallow(<SavePlot store={store_with_selected_cell}/>).dive()
        expect(save_plot).to.have.lengthOf(1)
    });

    it('renders without exploding', () => {
        const store = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "0_0_0"
                }
            }
        })
        const event = {
            target: {
                value: "teststring"
            }
        }
        var save_plot = shallow(<SavePlot store={store}/>).dive()
        expect(save_plot).to.have.lengthOf(1)
        expect(save_plot.state().name).to.equal("")
        save_plot.find("#save-plot-text-input").simulate("change", event)
        expect(save_plot.state().name).to.equal(event.target.value)
    });
});