import BaseModel from './BaseModel.js';
import $ from 'jquery'
import _ from 'lodash'

class ColormapModel extends BaseModel {
    static reduce(state=[], action) {
        switch(action.type){
            case "INITIALIZE_COLORMAPS":
                return action.colormaps
            case "SAVE_COLORMAP":
                return $.extend(true, {}, state, action.colormap)
            case "DELETE_COLORMAP":
                return _.omit(state, action.name)
            default:
                return state;
        }
    }

    static getInitialState() {
        return $.get("getColormaps");
    }
}

export default ColormapModel
