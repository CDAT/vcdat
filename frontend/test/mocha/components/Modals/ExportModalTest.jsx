/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import ExportModal from "../../../../src/js/components/modals/ExportModal.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { createMockStore } from 'redux-test-utils'
import { shallow } from "enzyme";

const getProps = () => {
    return {
        plots: [{
            graphics_method_parent: "boxfill",
            graphics_method: "default",
            variables: []
        }],
        show: true,
        close: () => {}
    };
};

describe("ExportModalTest.jsx", function() {
    it("renders without exploding", () => {

        var test_plot1 = {
            variables: [], // testing inspector
            graphics_method_parent: 'boxfill',
            graphics_method: 'default',
            template: 'default'
        }

        var test_plot2 = {
            variables: ['clt'], // testing inspector
            graphics_method_parent: 'boxfill',
            graphics_method: 'default',
            template: 'default'
        }
        
        var test_cell1 = {
            plot_being_edited: 0,
            plots: [test_plot1]
        }

        var test_cell2 = {
            plot_being_edited: 1,
            plots: [test_plot1,test_plot2]
        }

        const test_sheet1 = {
            name: 'Sheet',
            col_count: 1,
            row_count: 1,
            selected_cell_indices: [
                [-1, -1]
            ],
            cells: [
                [test_cell1]
            ],
            sheet_index: 0,
        }

        const test_sheet2 = {
            name: 'Sheet',
            col_count: 1,
            row_count: 1,
            selected_cell_indices: [
                [0, 1]
            ],
            cells: [
                [test_cell1,test_cell2],[test_cell2,test_cell1]
            ],
            sheet_index: 0,
        }

        const test_sheet3 = {
            name: 'Sheet',
            col_count: 1,
            row_count: 1,
            selected_cell_indices: [
                [1, 0]
            ],
            cells: [
                [test_cell1,test_cell2],[test_cell2,test_cell1]
            ],
            sheet_index: 0,
        }

        const store_with_no_selected_cell = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "-1_-1_-1",
                    cur_sheet_index: 0,
                    sheets: [test_sheet1]
                }
            }
        })
        const store_with_selected_cell = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "0_0_0",
                    cur_sheet_index: 0,
                    sheets: [test_sheet1,test_sheet2,test_sheet3]
                }
            }
        })
        const store_with_selected_cell2 = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "0_0_0",
                    cur_sheet_index: 1,
                    sheets: [test_sheet1,test_sheet2,test_sheet3]
                }
            }
        })
        const store_with_selected_cell3 = createMockStore({
            present: {
                sheets_model:{
                    selected_cell_id: "0_0_0",
                    cur_sheet_index: 2,
                    sheets: [test_sheet1,test_sheet2,test_sheet3]
                }
            }
        })
        const props = getProps();
        var export_modal = shallow(<ExportModal store={store_with_no_selected_cell} {...props} />);
        expect(export_modal).to.have.lengthOf(1);

        export_modal = shallow(<ExportModal store={store_with_selected_cell} {...props} />);
        expect(export_modal).to.have.lengthOf(1);

        export_modal = shallow(<ExportModal store={store_with_selected_cell2} {...props} />);
        expect(export_modal).to.have.lengthOf(1);

        export_modal = shallow(<ExportModal store={store_with_selected_cell3} {...props} />);
        expect(export_modal).to.have.lengthOf(1);
    });
});