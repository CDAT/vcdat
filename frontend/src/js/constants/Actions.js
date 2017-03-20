var Actions = {
    rowCountChanged(count) {
        return {
            type: 'ROW_COUNT_CHANGED',
            count: count
        }
    },
    colCountChanged(count) {
        return {
            type: 'COL_COUNT_CHANGED',
            count: count,
        }
    },
    addSheet() {
        return {
            type: 'ADD_SHEET'
        }
    },
    removeSheet(index) {
        return {
            type: 'REMOVE_SHEET',
            sheet_index: index
        }
    },
    changeCurSheetIndex(index) {
        return {
            type: 'CHANGE_CUR_SHEET_INDEX',
            index: index
        }
    },
    changePlot(value) {
        return {
            type: 'CHANGE_PLOT',
            value: value
        }
    },
    changePlotVar(var_being_changed, value) {
        return {
            type: 'CHANGE_PLOT_VAR',
            var_being_changed: var_being_changed,
            value: value
        }
    },
    changePlotGM(parent, value) {
        var obj = {
            type: 'CHANGE_PLOT_GM',
        }
        if (parent) {
            obj.graphics_method_parent = value
        } else {
            obj.graphics_method = value
        }
        return obj;
    },
    changePlotTemplate(value) {
        return {
            type: 'CHANGE_PLOT_TEMPLATE',
            value: value
        }
    },
    initializeTemplateValues(templates) {
        return {
            type: 'INITIALIZE_TEMPLATE_VALUES',
            templates: templates
        }
    },
    initializeGraphicsMethodsValues(gm) {
        return {
            type: 'INITIALIZE_GRAPHICS_METHODS_VALUES',
            graphics_methods: gm
        }
    },
    updateSelectedCells(selected_cells) {
        return {
            type: 'UPDATE_SELECTED_CELLS',
            selected_cells: selected_cells
        }
    },
    moveColumn(dragged_index, dropped_index, position) {
        return {
            type: 'MOVE_COLUMN',
            dragged_index: dragged_index,
            dropped_index: dropped_index,
            position: position
        }
    },
    moveRow(dragged_index, dropped_index, position) {
        return {
            type: 'MOVE_ROW',
            dragged_index: dragged_index,
            dropped_index: dropped_index,
            position: position
        }
    },
    addPlot(variable, graphics_method_parent, graphics_method, template, row, col) {
        return {
            type: 'ADD_PLOT',
            variable: variable,
            graphics_method_parent: graphics_method_parent,
            graphics_method: graphics_method,
            template: template,
            row: row,
            col: col
        }
    },
    swapVariableInPlot(value, row, col, plot_index, var_being_changed) {
        return {
            type: 'CHANGE_PLOT_VAR',
            value: value,
            row: row,
            col: col,
            plot_index: plot_index,
            var_being_changed: var_being_changed
        }
    },
    swapGraphicsMethodInPlot(graphics_method_parent, graphics_method, row, col, plot_index) {
        return {
            type: 'CHANGE_PLOT_GM',
            graphics_method_parent: graphics_method_parent,
            graphics_method: graphics_method,
            row: row,
            col: col,
            plot_index: plot_index
        }
    },
    swapTemplateInPlot(value, row, col, plot_index) {
        return {
            type: 'CHANGE_PLOT_TEMPLATE',
            value: value,
            row: row,
            col: col,
            plot_index: plot_index
        }
    },
    shiftSheet(old_position, new_position) {
        return {
            type: 'SHIFT_SHEET',
            old_position: old_position,
            new_position: new_position
        }
    },
    loadVariables(var_list) {
        return {
            type: 'LOAD_VARIABLES',
            var_list: var_list
        }
    },
    addFileToCache(filename, filepath, variables){
        return {
            type: 'ADD_FILE_TO_CACHE',
            filename: filename,
            filepath: filepath,
            variables: variables
        }
    },
    updateGraphicsMethod(graphics_method) {
        return {
            type: 'UPDATE_GRAPHICS_METHOD',
            graphics_method
        }
    },
    initializeColormaps(colormaps) {
        return {
            type: 'INITIALIZE_COLORMAPS',
            colormaps: colormaps
        }
    },
    initializeDefaultMethods(defaults) {
        return {
            type: 'INITIALIZE_DEFAULT_METHODS',
            defaultmethods: defaults
        }
    },
    updateTemplate(template) {
        return {
            type: 'UPDATE_TEMPLATE',
            template:template
        }
    },
}

export default Actions;
