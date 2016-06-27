var Actions = {
    addItem(item){
        return {
            type: 'ADD_ITEM',
            item: item
        }
    },
    layoutInitialized(layout){
        return {
            type: 'LAYOUT_INITIALIZED',
            layout:layout
        }
    }

}

export default Actions;
