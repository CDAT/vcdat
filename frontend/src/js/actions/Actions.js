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
            count: count
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
    changePlotVar(var_being_changed, value) {
        return {
            type: 'CHANGE_PLOT_VAR',
            var_being_changed: var_being_changed,
            value: value
        }
    },
    changePlotGM(parent, value) {
        return {
            type: 'CHANGE_PLOT_GM',
            parent: parent,
            value: value
        }
    },
    changePlotTemplate(value) {
        return {
            type: 'CHANGE_PLOT_TEMPLATE',
            value: value
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
    moveRow(dragged_index, dropped_index, position){
        return {
            type: 'MOVE_ROW',
            dragged_index: dragged_index,
            dropped_index: dropped_index,
            position: position
        }
    }
}

export default Actions;
