import BaseModel from './BaseModel.js';
import $ from 'jquery'

class UIModel extends BaseModel {
    static reduce(state={}, action) {
        let new_state;
        switch (action.type) {
            case 'CREATE_TEMPLATE':
                new_state = $.extend(true, {}, state);
                new_state.selected_template = action.name
                return new_state
            case 'SELECT_TEMPLATE':
                new_state = $.extend(true, {}, state);
                new_state.selected_template = action.selected_template
                return new_state
            case 'REMOVE_TEMPLATE':
                new_state = $.extend(true, {}, state);
                if(new_state.selected_template === action.name){
                    new_state.selected_template = ""
                }
                return new_state
            case "CREATE_GRAPHICS_METHOD":
                new_state = $.extend(true, {}, state);
                new_state.selected_graphics_method = action.name
                new_state.selected_graphics_type= action.gm_type
                return new_state
            case "SELECT_GRAPHICS_METHOD":
                new_state = $.extend(true, {}, state);
                new_state.selected_graphics_method = action.method
                new_state.selected_graphics_type= action.gm_type
                return new_state
            default:
                return state;
        }
    }

    static getInitialState() {
        return {
            selected_template: "",
            selected_graphics_type: "",
            selected_graphics_method: "",
        }
    }
}

export default UIModel
