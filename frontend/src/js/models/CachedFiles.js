import BaseModel from './BaseModel.js';


class CachedFileModel extends BaseModel {
    static reduce(state={}, action) {
        let new_state = jQuery.extend(true, {}, state)
        switch(action.type){
            case 'ADD_FILE_TO_CACHE':
                new_state[action.filename] = {
                    filepath: action.filepath,
                    variables: action.variables
                }
                return new_state;
            case 'SET_RECENT_LOCAL_PATH':
                new_state.recent_local_path = action.path
                return new_state
            default: return state;
        }
    }
}

export default CachedFileModel
