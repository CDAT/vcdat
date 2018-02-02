/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
import React from 'react';
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import Cell, { PureCell }  from '../../../src/js/components/Cell.jsx'
// Exported 'Pure' components are exported without higher order function wrappers, like redux, to make testing simpler
import sinon from 'sinon'

// const UnwrappedCell = Cell.DecoratedComponent; 
// Cell is normally wrapped with react-dnd. It provides .DecoratedComponent to unwrap it
// const state= {
//     present: {
//         sheets_model: {
//             sheets: [
//                 {row_count: 1, col_count: 1, cells: [{}]}
//             ],
//             cur_sheet_index: 0
//         }
//     }
// }

function getProps(){
    return {
        cells: [[{plots: []}]],
        row: 0,
        col: 0,
        swapVariableInPlot: sinon.spy(),
        swapGraphicsMethodInPlot: sinon.spy(),
        swapTemplateInPlot: sinon.spy(),
        connectDropTarget: (el) => el,
        isOver: false,
        selectCell: sinon.spy(),
        deselectCell: sinon.spy(),
        selected_cell_id: "",
        clearCell: sinon.spy(),
        sheet_index: 0,
    }
}

// const store = createMockStore(state)
// const dummyFunction = (el) => el;

describe('CellTest.jsx', function() {
    // it('renders without exploding', function() {
    //     const cell_container = shallow(<UnwrappedCell connectDragSource={dummyFunction} store={store}/>)
    //     expect(cell_container).to.have.lengthOf(1);
    // });

    it('renders without exploding', function() {
        const props = getProps()
        const cell = shallow(<PureCell {...props}/>)
        expect(cell).to.have.lengthOf(1);
    });

    it('Returns the correct cell id string', function() {
        let props = getProps()
        let cell = shallow(<PureCell {...props}/>)
        expect(cell.instance().getOwnCellId()).to.equal("0_0_0")

        props.sheet_index = 1
        props.row = 2
        props.col = 3
        props.cells = [
            [],
            [],
            [{}, {}, {}, {plots: []}]
        ]
        cell = shallow(<PureCell {...props}/>)
        expect(cell.instance().getOwnCellId()).to.equal("1_2_3")
    });

    it('Selects a cell properly', function() {
        let props = getProps()
        let cell = shallow(<PureCell {...props}/>)
        cell.instance().selectCell()
        expect(props.selectCell.calledWith("0_0_0")).to.be.true

        props.sheet_index = 1
        props.row = 2
        props.col = 3
        props.cells = [
            [],
            [],
            [{}, {}, {}, {plots: []}]
        ]
        cell = shallow(<PureCell {...props}/>)
        cell.instance().selectCell()
        expect(props.selectCell.calledWith("1_2_3")).to.be.true

        
        props = getProps()
        props.selected_cell_id = "0_0_0"
        cell = shallow(<PureCell {...props}/>)
        cell.instance().selectCell() // should NOT call selectCell if it already selected
        expect(props.selectCell.callCount).to.equal(0)
    });
    
    // selectCell(){
    //     let id = this.getOwnCellId()
    //     if(this.props.selected_cell_id == id){
    //         // this.props.deselectCell() // if a cell is selected, a user clicking on it should deselect it.
    //         // Turning this feature off since a user manipulating an interactive plot toggles the selection too much
    //         return
    //     }
    //     else{
    //         this.props.selectCell(id)
    //     }
    // }
});
