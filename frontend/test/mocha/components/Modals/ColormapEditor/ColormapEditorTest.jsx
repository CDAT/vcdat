/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColormapEditor from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { PureColormapEditor } from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { shallow, mount } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import sinon from 'sinon'

describe('ColormapEditorTest.jsx', function() {
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

    it('renders without exploding', () => {
        // Note that this test is rendering the default component with redux
        // Other tests will use the "pure" export without the redux connect wrapper
        const state = { 
            present: {
                sheets_model: {
                    sheets: [
                        {row_count: 1, col_count: 1}
                    ],
                    selected_cell_id: "0_0_0",
                    cur_sheet_index: 0
                }
            }
        }
        const store = createMockStore(state)
        const colormap_editor = shallow(<ColormapEditor store={store}/>)
        expect(colormap_editor).to.have.lengthOf(1);
    });

    // it('loads the selected colormap', () => {
    //     const colormap_widget = shallow(<ColormapEditor store={store}/>)
    //     let change_event = {
    //         target: {
    //             value: "testSelect"
    //         }
    //     }
    //     colormap_widget.find('select.form-control').at(0).simulate("change", change_event)
    //     expect(colormap_widget.state().currentColormap[0][0]).to.equal(0) // first cell red should be 0
    //     expect(colormap_widget.state().currentColormap[1][0]).to.equal(70) // second cell red should be 70
    //     expect(colormap_widget.state().currentColormap[2][0]).to.equal(100) // third cell red should be 100
    // });
    
    // it('deletes a colormap properly', () => {
    //     var state = { 
    //         present: {
    //             sheets_model: {
    //                 sheets: [
    //                     {row_count: 1, col_count: 1}
    //                 ],
    //                 selected_cell_id: "0_0_0",
    //                 cur_sheet_index: 0
    //             }
    //         }
    //     }
    //     const store = createMockStore(state)
    //     const colormap_editor = mount(<ColormapEditor store={store}/>)
    //     let clock = sinon.useFakeTimers() // replace setTimout with a fake version that can be manipulated/ran synchronously
    //     let warn = console.warn
    //     console.warn = function(){return} // disable console.warn to prevent unnecessary warnings about vcs being missing
    //     const confirm = sinon.stub(global, 'confirm')
    //     confirm.returns(true)
    //     global.vcs = {
    //         deleteColormap() {
    //             return Promise.resolve()
    //         }
    //     }
    //     colormap_editor.instance().handleSelectColormap("testSelect")
    //     colormap_editor.instance().handleDeleteColormap("testSelect")
    //     clock.runAll() // force all setTimeout calls to process
    //     expect(colormap_editor.state().selectedColormapName).to.equal("viridis") // since it is the only colormap left, viridis should be selected
    //     for(let cell = 0; cell < 3; cell++){
    //         for(let color_index = 0; color_index < 3; color_index++){
    //             expect(colormap_editor.state().currentColormap[cell][color_index]).to.equal(props.colormaps.viridis[cell][color_index])
    //         }
    //     }
    //     clock.restore()
    //     console.warn = warn // restore console.warn
    //     confirm.restore()
    // });
});