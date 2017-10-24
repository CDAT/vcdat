import BaseModel from './BaseModel.js';


class ColormapModel extends BaseModel {
    static reduce(state=[], action) {
        switch(action.type){
            case "INITIALIZE_COLORMAPS":
                return action.colormaps
            case "SAVE_COLORMAP":
                return Object.assign({}, state, action.colormap)
            default:
                return state;
        }
    }

    static getInitialState() {
        return $.get("getColormaps");
    }
}

export default ColormapModel
