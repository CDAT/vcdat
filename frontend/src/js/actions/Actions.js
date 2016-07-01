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
    addSheet(){
        return {
            type: 'ADD_SHEET'
        }
    },
    changeCurSheetIndex(index){
        return {
            type: 'CHANGE_CUR_SHEET_INDEX',
            index: index
        }
    }

}

export default Actions;
