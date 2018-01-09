/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
import Actions from '../../../src/js/constants/Actions.js'

describe('ActionsTest.js', function() {
    it('rowCountChanged works', () => {
        let result = Actions.rowCountChanged(2)
        let expected = {
            type: 'ROW_COUNT_CHANGED',
            count: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('colCountChanged works', () => {
        let result = Actions.colCountChanged(2)
        let expected = {
            type: 'COL_COUNT_CHANGED',
            count: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('addSheet works', () => {
        let result = Actions.addSheet()
        let expected = {
            type: 'ADD_SHEET',
        }
        expect(result).to.deep.equal(expected)
    });

    it('removeSheet works', () => {
        let result = Actions.removeSheet(2)
        let expected = {
            type: 'REMOVE_SHEET',
            sheet_index: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('changeCurSheetIndex works', () => {
        let result = Actions.changeCurSheetIndex(2)
        let expected = {
            type: 'CHANGE_CUR_SHEET_INDEX',
            index: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('changePlot works', () => {
        let result = Actions.changePlot(2)
        let expected = {
            type: 'CHANGE_PLOT',
            value: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('changePlotVar works', () => {
        let result = Actions.changePlotVar("variable", 2)
        let expected = {
            type: 'CHANGE_PLOT_VAR',
            var_being_changed: "variable",
            value: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('changePlotGM works', () => {
        let result = Actions.changePlotGM({}, "newValue")
        let expected = {
            type: 'CHANGE_PLOT_GM',
            graphics_method_parent: "newValue"
        }
        expect(result).to.deep.equal(expected)

        result = Actions.changePlotGM(undefined, "newValue")
        expected = {
            type: 'CHANGE_PLOT_GM',
            graphics_method: "newValue"
        }
        expect(result).to.deep.equal(expected)
    });

    it('changePlotTemplate works', () => {
        let result = Actions.changePlotTemplate(2)
        let expected = {
            type: 'CHANGE_PLOT_TEMPLATE',
            value: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('initializeTemplateValues works', () => {
        let result = Actions.initializeTemplateValues([{name: "template1"}, {name: "template2"}])
        let expected = {
            type: 'INITIALIZE_TEMPLATE_VALUES',
            templates: [{name: "template1"}, {name: "template2"}]
        }
        expect(result).to.deep.equal(expected)
    });

    it('selectCell works', () => {
        let result = Actions.selectCell(1)
        let expected = {
            type: 'SELECT_CELL',
            cell_id: 1
        }
        expect(result).to.deep.equal(expected)
    });

    it('deselectCell works', () => {
        let result = Actions.deselectCell(1)
        let expected = {
            type: 'DESELECT_CELL',
        }
        expect(result).to.deep.equal(expected)
    });

    it('updateSelectedCells works', () => {
        let result = Actions.updateSelectedCells([1,2])
        let expected = {
            type: 'UPDATE_SELECTED_CELLS',
            selected_cells: [1,2]
        }
        expect(result).to.deep.equal(expected)
    });

    it('moveColumn works', () => {
        let result = Actions.moveColumn(1, 2, 3)
        let expected = {
            type: 'MOVE_COLUMN',
            dragged_index: 1,
            dropped_index: 2,
            position: 3
        }
        expect(result).to.deep.equal(expected)
    });

    it('moveRow works', () => {
        let result = Actions.moveRow(1, 2, 3)
        let expected = {
            type: 'MOVE_ROW',
            dragged_index: 1,
            dropped_index: 2,
            position: 3
        }
        expect(result).to.deep.equal(expected)
    });

    it('clearCell works', () => {
        let result = Actions.clearCell(1, 2)
        let expected = {
            type: 'CLEAR_CELL',
            row: 1,
            col: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('addPlot works', () => {
        let result = Actions.addPlot("variable", "graphics_method_parent", "graphics_method", "template", 1, 2)
        let expected = {
            type: 'ADD_PLOT',
            variable: "variable",
            graphics_method_parent: "graphics_method_parent",
            graphics_method: "graphics_method",
            template: "template",
            row: 1,
            col: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('swapVariableInPlot works', () => {
        let result = Actions.swapVariableInPlot("value", 1, 2, 3, "var_being_changed")
        let expected = {
            type: 'CHANGE_PLOT_VAR',
            value: "value",
            row: 1,
            col: 2,
            plot_index: 3,
            var_being_changed: "var_being_changed"
        }
        expect(result).to.deep.equal(expected)
    });

    it('swapGraphicsMethodInPlot works', () => {
        let result = Actions.swapGraphicsMethodInPlot("graphics_method_parent", "graphics_method", 1, 2, 3)
        let expected = {
            type: 'CHANGE_PLOT_GM',
            graphics_method_parent: "graphics_method_parent",
            graphics_method: "graphics_method",
            row: 1,
            col: 2,
            plot_index: 3
        }
        expect(result).to.deep.equal(expected)
    });

    it('swapTemplateInPlot works', () => {
        let result = Actions.swapTemplateInPlot("value", 1, 2, 3)
        let expected = {
            type: 'CHANGE_PLOT_TEMPLATE',
            value: "value",
            row: 1,
            col: 2,
            plot_index: 3,
        }
        expect(result).to.deep.equal(expected)
    });

    it('shiftSheet works', () => {
        let result = Actions.shiftSheet(1, 2)
        let expected = {
            type: 'SHIFT_SHEET',
            old_position: 1,
            new_position: 2
        }
        expect(result).to.deep.equal(expected)
    });

    it('loadVariables works', () => {
        let result = Actions.loadVariables(["var1", "var2", "var3"])
        let expected = {
            type: 'LOAD_VARIABLES',
            var_list: ["var1", "var2", "var3"]
        }
        expect(result).to.deep.equal(expected)
    });

    it('addFileToCache works', () => {
        let result = Actions.addFileToCache("filename", "filepath", ["var1", "var2"])
        let expected = {
            type: 'ADD_FILE_TO_CACHE',
            filename: "filename",
            filepath: "filepath", 
            variables: ["var1", "var2"]
        }
        expect(result).to.deep.equal(expected)
    });

    it('updateGraphicsMethod works', () => {
        let result = Actions.updateGraphicsMethod("graphics_method")
        let expected = {
            type: 'UPDATE_GRAPHICS_METHOD',
            graphics_method: "graphics_method"
        }
        expect(result).to.deep.equal(expected)
    });

    it('initializeColormaps works', () => {
        let result = Actions.initializeColormaps(["map1", "map2"])
        let expected = {
            type: 'INITIALIZE_COLORMAPS',
            colormaps: ["map1", "map2"]
        }
        expect(result).to.deep.equal(expected)
    });

    it('updateTemplate works', () => {
        let result = Actions.updateTemplate("template")
        let expected = {
            type: 'UPDATE_TEMPLATE',
            template: "template" 
        }
        expect(result).to.deep.equal(expected)
    });

    it('saveColormap works', () => {
        let result = Actions.saveColormap("colormap")
        let expected = {
            type: 'SAVE_COLORMAP',
            colormap: "colormap" 
        }
        expect(result).to.deep.equal(expected)
    });

    it('deleteColormap works', () => {
        let result = Actions.deleteColormap("name")
        let expected = {
            type: 'DELETE_COLORMAP',
            name: "name" 
        }
        expect(result).to.deep.equal(expected)
    });
});