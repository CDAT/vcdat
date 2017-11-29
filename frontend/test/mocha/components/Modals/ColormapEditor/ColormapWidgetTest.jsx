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
        ],
        "testSelect": [
            [0, 0, 0, 100],
            [70, 70, 70, 100],
            [100, 100, 100, 100],
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

    it('Cells respond to color changes in props appropriately', () => {
        var first_props = {
            color: {
                hex: "#ffffff",
                hsl: {h: 0, s: 0, l: 1, a: 1},
                hsv: {h: 0, s: 0, v: 1, a: 1},
                oldHue: 0,
                rgb: {r: 255, g: 255, b: 255, a: 1},
                source: undefined
            }
        }
        var second_props = {
            color:{
                hex: "#000000",
                hsl: {h: 6.162162162162163, s: 0, l: 0.6, a: 1},
                hsv: {h: 6.162162162162163, s: 0, v: 0.6, a: 1},
                oldHue: 6.162162162162163,
                rgb: {r: 0, g: 0, b: 0, a: 1},
                source: undefined
            }
        }
        colormap_widget.setProps(first_props)
        // We now check that the active cell (cell 0) has not changed across it's rgb values
        // We ignore the first set of props so that the first cell does not change when the colormap first opens
        expect(colormap_widget.state().currentColormap[0][0]).to.equal(100)
        expect(colormap_widget.state().currentColormap[0][1]).to.equal(100)
        expect(colormap_widget.state().currentColormap[0][2]).to.equal(100)

        colormap_widget.setProps(second_props)
        expect(colormap_widget.state().currentColormap[0][0]).to.equal(0)
        expect(colormap_widget.state().currentColormap[0][1]).to.equal(0)
        expect(colormap_widget.state().currentColormap[0][2]).to.equal(0)
    });

    it('loads the selected colormap', () => {
        let change_event = {
            target: {
                value: "testSelect"
            }
        }
        colormap_widget.find('select.form-control').at(0).simulate("change", change_event)
        expect(colormap_widget.state().currentColormap[0][0]).to.equal(0) // first cell red should be 0
        expect(colormap_widget.state().currentColormap[1][0]).to.equal(70) // second cell red should be 70
        expect(colormap_widget.state().currentColormap[2][0]).to.equal(100) // third cell red should be 100
    });

    it('blends a colormap properly', () => {
        colormap_widget.setState({
            selectedCellsStart: 0,
            selectedCellsEnd: 2
        })
        colormap_widget.instance().blendColors()
        expect(colormap_widget.state().currentColormap[0][0]).to.equal(0) // first cell red should be 0
        expect(colormap_widget.state().currentColormap[0][1]).to.equal(0) // first cell green should be 0
        expect(colormap_widget.state().currentColormap[0][2]).to.equal(0) // first cell blue should be 0
        expect(colormap_widget.state().currentColormap[1][0]).to.equal(50) // second cell red should be 70
        expect(colormap_widget.state().currentColormap[1][1]).to.equal(50) // second cell green should be 70
        expect(colormap_widget.state().currentColormap[1][2]).to.equal(50) // second cell blue should be 70
        expect(colormap_widget.state().currentColormap[2][0]).to.equal(100) // third cell red should be 100
        expect(colormap_widget.state().currentColormap[2][1]).to.equal(100) // third cell green should be 100
        expect(colormap_widget.state().currentColormap[2][2]).to.equal(100) // third cell blue should be 100
    });

});

