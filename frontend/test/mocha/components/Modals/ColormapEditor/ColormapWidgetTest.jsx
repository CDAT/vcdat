/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var React = require('react');

import { PureColormapWidget } from '../../../../../src/js/components/modals/ColormapEditor/ColormapWidget.jsx'
import { mount } from 'enzyme'
import sinon from 'sinon'

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
    onChange: function(){return},
    deleteColormap: function(){return}
}

describe('ColormapWidgetTest.jsx', function() {

    it('renders without exploding', () => {
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
        expect(colormap_widget).to.have.lengthOf(1);
    });
    
    it('renders the correct number of cells', () => {
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
        expect(colormap_widget.find('.cells')).to.have.lengthOf(3)
    });

    it('makes a cell active when clicked', () => {
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
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
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
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
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
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

    it('blends a colormap properly', () => {
        const blend_props = {
            colormaps: {
                "viridis":[ // viridis will be loaded by default. Change the values here to something we can blend
                    [0, 0, 0, 100], // 3 cells total
                    [0, 0, 0, 100], // this cell will be blended to [50, 50, 50]
                    [100, 100, 100, 100],
                ],
            },
            sheets_model: {
                sheets: [
                    {row_count: 1, col_count: 1}
                ],
                cur_sheet_index: 0
            },
        }
        const colormap_widget = mount(<PureColormapWidget {...blend_props}/>)
        colormap_widget.setState({
            selectedCellsStart: 0,
            selectedCellsEnd: 2
        })
        colormap_widget.instance().blendColors()
        let blended_values = [0, 50, 100]
        for(let cell = 0; cell < 3; cell++){
            for(let color_index = 0; color_index < 3; color_index++){
                expect(colormap_widget.state().currentColormap[cell][color_index]).to.equal(blended_values[cell])
            }
        }
    });

    it('resets a colormap properly', () => {
        const colormap_widget = mount(<PureColormapWidget {...props}/>)
        colormap_widget.instance().handleColormapSelect("testSelect")
        colormap_widget.setState({selectedCellsStart: 1, selectedCellsEnd: 1})
        colormap_widget.setProps({
            color: {
                rgb:{
                    r: 41,
                    g: 41,
                    b: 41,
                }
            }
        })
        expect(colormap_widget.instance().state.currentColormap[1][0]).to.equal(16)
        expect(colormap_widget.instance().state.currentColormap[1][1]).to.equal(16)
        expect(colormap_widget.instance().state.currentColormap[1][2]).to.equal(16)
        colormap_widget.instance().resetColormap()
        for(let cell = 0; cell < 3; cell++){
            for(let color_index = 0; color_index < 3; color_index++){
                expect(colormap_widget.state().currentColormap[cell][color_index]).to.equal(props.colormaps.testSelect[cell][color_index])
            }
        }
    });

    it('saves a colormap', () => {
        let dummy_save = sinon.spy()
        global.vcs = {
            setcolormap: function(){
                return new Promise((resolve) => {
                    resolve("");
                })
            },
        }
        const colormap_widget = mount(<PureColormapWidget {...props} saveColormap={dummy_save}/>)
        colormap_widget.instance().saveColormap("name").then(()=>{
            sinon.assert.calledOnce(dummy_save)
            // dummy save represents the call to redux to save the colormap
        },
        () => { // Should not error. assert false to catch if it does
            assert(false)
        })
         
    })

    it('Applies a colormap correctly', (done) => {
        global.vcs = {
            getcolormapnames: function(){
                return new Promise((resolve) => {
                    resolve(["default", "viridis", "testSelect"]);
                })
            },
            setcolormap: function(){
                return new Promise((resolve) => {
                    resolve("");
                })
            },
            createcolormap: function(){
                return new Promise((resolve) => {
                    resolve("");
                })
            }
        }
        
        let extra_props = {
            saveColormap: sinon.spy(),
            updateGraphicsMethod: sinon.spy(),
            applyColormap: sinon.spy(),
            graphics_methods: {
                boxfill:{
                    default:{}
                }
            },
            sheet: {
                cells:[[
                    {
                        plots: [
                            {
                                graphics_method_parent: "boxfill",
                                graphics_method: "default"
                            }
                        ]
                    }
                ]]
            }
        }
        
        const colormap_widget = mount(<PureColormapWidget {...props} {...extra_props}/>)
        colormap_widget.instance().applyColormap("test_name", 0, 0).then(() => {
            sinon.assert.called(extra_props.updateGraphicsMethod)
            sinon.assert.called(extra_props.applyColormap)
            done()
        })
    })
});

