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
        try{
            if(vcs){ // will throw an error if vcs server is not running/unreachable. This is caught as "ReferenceError" below
                // This code is rather hard to read, but vcs.js does not provide a 'getallcolormaps' function 
                return new Promise((resolve, reject) => { // Configure store expects an object, rather than an array, so we wrap a promise around promise.all
                    vcs.colormapnames().then((names) => { 
                        return Promise.all(names.map((name) => { // The array of colormaps starts as an array of promises. Use promise all to wait for all of them to finish
                            return vcs.getcolormap(name).then((map) => { // for each colormap name, create an object with the name and the colormap data
                                return {name: name, colormap: map}
                            })
                        })).then((colormaps) => { // After every promise is resolved in the array, we have all of the data we need from the vcs server
                            let finished_colormaps = {}
                            colormaps.forEach((obj) => {   // loop over the array and create the colormap object the app is expecting
                                finished_colormaps[obj.name] = obj.colormap
                            })
                            resolve(finished_colormaps)
                        })
                    })
                })
            }
        }
        catch(e){
            if(e.name == "ReferenceError"){
                return $.get("getColormaps");
                console.warn("Warning: vcs is not defined. Is the vcs server running?")
            }
            else{
                throw e
            }
        }
    }
}

export default ColormapModel
