/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColormapEditor from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { PureColormapEditor } from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import sinon from 'sinon'

describe('ColormapEditorTest.jsx', function() {
    var stub;
    before(function() {
        stub = sinon.stub(PureColormapEditor.prototype, 'handleApply').returns(true);
    });
    afterEach(function(){ 
        stub.reset()
    });
    it('renders without exploding', () => {
        // Note that this test is rendering the default component with redux
        // Other tests will use the "pure" export without the redux connect wrapper
        var state = { 
            present: {
                sheets_model: {
                    sheets: [
                        {row_count: 1, col_count: 1}
                    ],
                    cur_sheet_index: 0
                }
            }
        }
        const store = createMockStore(state)
        var colormap_editor = shallow(<ColormapEditor store={store}/>)
        expect(colormap_editor).to.have.lengthOf(1);
    });
    it('renders the correct apply button for a single cell', () => {
        var props = {
            sheet_num_rows: 1,
            sheet_num_cols: 1,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find("#colormap-apply-dropup")
        expect(menu_options).to.have.lengthOf(1);
        menu_options.simulate("click")
        sinon.assert.callCount(stub, 1)
    });
    it('renders the correct apply button for 2 rows', () => {
        var props = {
            sheet_num_rows: 2,
            sheet_num_cols: 1,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(2);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 2)
    });
    
    it('renders the correct apply button for 2 cols', () => {
        var props = {
            sheet_num_rows: 1,
            sheet_num_cols: 2,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(2);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 2)
    });
    it('renders the correct apply button for 2 rows and 2 cols', () => {
        var props = {
            sheet_num_rows: 2,
            sheet_num_cols: 2,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(4);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 4)
    });
    it('renders the correct apply button for 3 rows and 2 cols', () => {
        var props = {
            sheet_num_rows: 3,
            sheet_num_cols: 2,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(6);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 6)
    });
    it('renders the correct apply button for 2 rows and 3 cols', () => {
        var props = {
            sheet_num_rows: 2,
            sheet_num_cols: 3,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(6);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 6)
    });
    it('renders the correct apply button for 3 rows and 3 cols', () => {
        var props = {
            sheet_num_rows: 3,
            sheet_num_cols: 3,
        }
        var colormap_editor = shallow(<PureColormapEditor {...props}/>)
        let menu_options = colormap_editor.find(".colormap-apply-menu").find("MenuItem")
        expect(menu_options).to.have.lengthOf(9);
        menu_options.map(function(item){
            item.simulate("click")
        })
        sinon.assert.callCount(stub, 9)
    });
});