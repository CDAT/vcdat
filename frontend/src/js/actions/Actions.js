var Actions = {
    addItem(item){
        return {
            type: 'ADD_ITEM',
            item: item
        }
    },
    configUpdated(config){
        return {
            type: 'CONFIG_UPDATED',
            config, config
        }
    }

}

export default Actions;
