/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
// import { createMockStore } from 'redux-test-utils'
import { PureCell }  from '../../../src/js/components/Cell.jsx'
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
    
    it('Selects a cell properly', function() {
        let props = getProps()
        let cell = shallow(<PureCell {...props}/>)

        let empty_plot = {}
        expect(cell.instance().canPlot(empty_plot)).to.be.false
        // empty plot: false

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "boxfill",
            template: "default",
            variables: []
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.false
        // one var plot, no variable: false

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "boxfill",
            template: "default",
            variables: ["clt"]
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.true
        // one var plot with var: true

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "vector",
            template: "default",
            variables: []
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.false
        // two var plot, no var: false

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "vector",
            template: "default",
            variables: ["clt"]
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.false
        // two var plot, one var (1st): false

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "vector",
            template: "default",
            variables: ["", "v"]
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.false
        // two var plot, one var (2nd): false:

        props.cells[0][0].plots[0] = {
            graphics_method: "default",
            graphics_method_parent: "vector",
            template: "default",
            variables: ["u", "v"]
        }
        expect(cell.instance().canPlot(props.cells[0][0])).to.be.true
        // two var plot: true
    });
});
