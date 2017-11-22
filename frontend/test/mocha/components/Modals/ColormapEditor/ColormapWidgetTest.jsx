/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import {PureColormapWidget} from '../../../../../src/js/components/modals/ColormapEditor/ColormapWidget.jsx'
import { mount } from 'enzyme'

const props = {
    colormaps: {
        "viridis":[
            [100, 100, 100, 100], // 3 cells total
            [70, 70, 70, 100],
            [40, 40, 40, 100],
        ]
    },
    sheets_model: {
        sheets: [
            {row_count: 1, col_count: 1}
        ],
        cur_sheet_index: 0
    },
    onChange: function(){return}
}


const colormap_widget = mount(<PureColormapWidget {...props}/>)

describe('ColormapWidgetTest.jsx', function() {

    it('renders without exploding', () => {
        expect(colormap_widget).to.have.lengthOf(1);
    });
    
    it('renders the correct number of cells', () => {
        expect(colormap_widget.find('.cells')).to.have.lengthOf(3)
    });

    it('makes a cell active when clicked', () => {
        let click_event = {
            target: {
                innerText: "1"
            }
        }
        colormap_widget.find('.cells').at(1).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(1)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(1)

        click_event.target.innerText = "2"
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(2)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(2)
    });

    it('makes multiple cells active when shift clicked', () => {
        let click_event = {
            target: {
                innerText: "2"
            },
            shiftKey: false,
        }
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(2)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(2)

        click_event.target.innerText = "0"
        click_event.shiftKey = true;
        colormap_widget.find('.cells').at(0).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(2)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(0)
    })

    it('does not change active cells if cell text is NaN', () => {
        let click_event = {
            target: {
                innerText: "0"
            }
        }
        colormap_widget.find('.cells').at(0).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(0)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(0)

        click_event.target.innerText = "not_a_number"
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(colormap_widget.state().selectedCellsStart).to.equal(0)
        expect(colormap_widget.state().selectedCellsEnd).to.equal(0)
    });

});

