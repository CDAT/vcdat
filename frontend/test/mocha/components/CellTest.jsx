/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
import React from 'react';
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import Cell from '../../../src/js/components/Cell.jsx'

const UnwrappedCell = Cell.DecoratedComponent; 
// Cell is normally wrapped with react-dnd. It provides .DecoratedComponent to unwrap it
const state= {
    present: {
        sheets_model: {
            sheets: [
                {row_count: 1, col_count: 1, cells: [{}]}
            ],
            cur_sheet_index: 0
        }
    }
}


const store = createMockStore(state)
const dummyFunction = (el) => el;

describe('CellTest.jsx', function() {
    it('renders without exploding', function() {
        const cell_container = shallow(<UnwrappedCell connectDragSource={dummyFunction} store={store}/>)
        expect(cell_container).to.have.lengthOf(1);
    });
});
