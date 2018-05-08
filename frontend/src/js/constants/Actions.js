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
    selectCell(cell_id){
        return {
            type: 'SELECT_CELL',
            cell_id: cell_id
        }
    },
    deselectCell(){
        return {
            type: 'DESELECT_CELL',
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
    clearCell(row, col){
        return({
            type: 'CLEAR_CELL',
            row: row,
            col: col,
        })
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
    deletePlot(row, col, index){
        return {
            type: 'DELETE_PLOT',
            row: row,
            col: col,
            index: index
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
    deleteVariableInPlot(row, col, plot_index, var_index){
        return{
            type: 'DELETE_PLOT_VAR',
            row: row,
            col: col,
            plot_index: plot_index,
            var_index: var_index
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
    updateVariable(name, dimensions, transforms){
        if(!transforms){
            transforms = {}
        }
        return {
            type: 'UPDATE_VARIABLE',
            name: name,
            dimensions: dimensions,
            transforms: transforms,
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
            template: template
        }
    },
    saveColormap(colormap) {
        return {
            type: 'SAVE_COLORMAP',
            colormap: colormap,
        }
    },
    deleteColormap(name) {
        return {
            type: 'DELETE_COLORMAP',
            name: name,
        }
    },
    removeVariable(name) { // Removes variable from list of loaded variables (left side bar)
        return {
            type: 'REMOVE_VARIABLE',
            name: name,
        }
    },
    setRecentLocalPath(path){
        // Used with the file explorer and file tab
        // The file tab passes this value to the file explorer
        // The file explorer will open the path it is given
        // This makes it so that a user doesnt have to navigate to the same place over and over
        return {
            type: 'SET_RECENT_LOCAL_PATH',
            path: path,
        }
    }
}

export default Actions;
