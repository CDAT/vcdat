import BaseModel from './BaseModel.js';


class CachedFileModel extends BaseModel {
    static reduce(state={}, action) {
        switch(action.type){
            case 'ADD_FILE_TO_CACHE':
                let new_state = jQuery.extend(true, {}, state)
                new_state[action.filename] = {
                    filepath: action.filepath,
                    variables: action.variables
                }
                return new_state;
            default: return state;
        }
    }
}

export default CachedFileModel
