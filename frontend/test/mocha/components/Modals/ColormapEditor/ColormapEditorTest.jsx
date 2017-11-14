/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColormapEditor from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

const state = {
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
const colormap_editor = shallow(<ColormapEditor store={store}/>)

describe('ColormapEditorTest.jsx', function() {
    it('renders without exploding', () => {
        expect(colormap_editor).to.have.lengthOf(1);
    });
});