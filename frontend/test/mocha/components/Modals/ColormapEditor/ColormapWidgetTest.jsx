/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColormapWidget from '../../../../../src/js/components/modals/ColormapEditor/ColormapWidget.jsx'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

const state = {
    present: {
        colormaps: {
            "default":[
                [100, 100, 100, 100],
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
    }
}

const store = createMockStore(state)
const colormap_widget = shallow(<ColormapWidget store={store}/>)

describe('ColormapWidgetTest.jsx', function() {
    it('renders without exploding', () => {
        expect(colormap_widget).to.have.lengthOf(1);
    });
});