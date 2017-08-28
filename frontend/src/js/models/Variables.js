import BaseModel from './BaseModel.js';


class VariablesModel extends BaseModel {
    static reduce(state = {}, action) {
        switch (action.type) {
            case 'LOAD_VARIABLES':
                var new_list = Object.assign({}, state); 
                action.var_list.forEach((var_obj) => {
                    let key = Object.keys(var_obj)[0];
                    new_list[key] = var_obj[key];
                })
                return new_list;
            default: return state
        }
    }
}

export default VariablesModel
