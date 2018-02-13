/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
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
        let blended_values = [0, 50, 100]
        for(let cell = 0; cell < 3; cell++){
            for(let color_index = 0; color_index < 3; color_index++){
                expect(colormap_widget.state().currentColormap[cell][color_index]).to.equal(blended_values[cell])
            }
        }
    });

    it('resets a colormap properly', () => {
        colormap_widget.instance().resetColormap("testSelect")
        for(let cell = 0; cell < 3; cell++){
            for(let color_index = 0; color_index < 3; color_index++){
                expect(colormap_widget.state().currentColormap[cell][color_index]).to.equal(props.colormaps.testSelect[cell][color_index])
            }
        }
    });

    it('deletes a colormap properly', () => {
        let clock = sinon.useFakeTimers() // replace setTimout with a fake version that can be manipulated/ran synchronously
        let warn = console.warn
        console.warn = function(){return} // disable console.warn to prevent unnecessary warnings about vcs being missing
        const confirm = sinon.stub(global, 'confirm')
        confirm.returns(true)
        global.vcs = {
            deleteColormap() {
                return Promise.resolve()
            }
        }

        colormap_widget.instance().handleColormapSelect("testSelect")
        colormap_widget.instance().handleDeleteColormap()
        clock.runAll() // force all setTimeout calls to process  
        expect(colormap_widget.state().selectedColormapName).to.equal("viridis") // since it is the only colormap left, viridis should be selected
        for(let cell = 0; cell < 3; cell++){
            for(let color_index = 0; color_index < 3; color_index++){
                expect(colormap_widget.state().currentColormap[cell][color_index]).to.equal(props.colormaps.viridis[cell][color_index])
            }
        }
        clock.restore()
        console.warn = warn // restore console.warn
        confirm.restore()
    });

    it('saves a colormap', () => {
        let dummy_save = sinon.spy()
        const colormap_widget = mount(<PureColormapWidget {...props} saveColormap={dummy_save}/>)
        colormap_widget.setState({
            newColormapTemplateName: "testSave",
        })
        expect(colormap_widget.find(".form-control.cm-name-input")).to.have.lengthOf(1)
        colormap_widget.find(".save-button").simulate("click")
        sinon.assert.calledOnce(dummy_save)
    })

    it('Does not save a colormap with no name', () => {
        let dummy_save = sinon.spy()
        const colormap_widget = mount(<PureColormapWidget {...props} saveColormap={dummy_save}/>)
        colormap_widget.setState({
            newColormapTemplateName: "",
        })
        expect(colormap_widget.find(".form-control.cm-name-input")).to.have.lengthOf(1)
        colormap_widget.find(".save-button").simulate("click")
        sinon.assert.notCalled(dummy_save)
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
        colormap_widget.instance().applyColormap(0,0).then(() => {
            sinon.assert.called(extra_props.updateGraphicsMethod)
            sinon.assert.called(extra_props.applyColormap)
            done()
        })
    })
});

