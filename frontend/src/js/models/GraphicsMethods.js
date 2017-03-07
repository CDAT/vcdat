import BaseModel from './BaseModel.js';
/* global $ */


class GraphicsMethodModel extends BaseModel {

    static reduce(state={}, action) {
        switch (action.type) {
            case "INITIALIZE_GRAPHICS_METHODS_VALUES":
                return action.graphics_methods;
            case "UPDATE_GRAPHICS_METHOD":
                let new_graphics_methods = Object.assign({}, state)
                const gm = action.graphics_method;
                switch (gm.g_name) {
                    case "Gfb":
                        new_graphics_methods["boxfill"][gm.name] = gm;
                        break;
                    case "Gfi":
                        new_graphics_methods["isofill"][gm.name] = gm;
                        break;
                    case "Gi":
                        new_graphics_methods["isoline"][gm.name] = gm;
                        break;
                    case "Gfm":
                        new_graphics_methods["meshfill"][gm.name] = gm;
                        break;
                    case "Gv":
                        new_graphics_methods["vector"][gm.name] = gm;
                        break;
                    case "G1d":
                        new_graphics_methods["oned"][gm.name] = gm;
                        break;
                    case "3d_scalar":
                        new_graphics_methods["3d_scalar"][gm.name] = gm;
                        break;
                    case "3d_dual_scalar":
                        new_graphics_methods["3d_dual_scalar"][gm.name] = gm;
                        break;
                    case "3d_vector":
                        new_graphics_methods["3d_vector"][gm.name] = gm;
                        break;
                }
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
