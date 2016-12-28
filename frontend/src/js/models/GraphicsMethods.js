import BaseModel from './BaseModel.js';
/* global $ */


class GraphicsMethodModel extends BaseModel {

    static reduce(state={}, action) {
        switch (action.type) {
            case "INITIALIZE_GRAPHICS_METHODS_VALUES":
                return action.graphics_methods;
            case "UPDATE_GRAPHICS_METHODS":
                let new_graphics_methods = Object.assign({}, action.graphics_methods)
                new_graphics_methods[action.gmParent][action.new_name] = action.gmProps
                return new_graphics_methods;
            default:
                return state
        }
    }

    static getInitialState() {
        return $.get("getGraphicsMethods");
    }

}

export default GraphicsMethodModel
