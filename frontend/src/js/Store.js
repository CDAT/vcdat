import { createStore } from 'redux'
import undoableReducer from './reducers/Reducer.js'
/* global $ */

var store;
const configureStore = (initialState = {}) => {
    let state = Promise.resolve(initialState);
    if (Object.keys(state).length === 0) {
        const default_method_promise = $.get("getDefaultMethods");
        const tmpl_promise = $.get("getTemplates");
        const gm_promise = $.get("getGraphicsMethods");
        const cmap_promise = $.get("getColormaps");
        state = Promise.all([default_method_promise, tmpl_promise, gm_promise, cmap_promise]).then((values) => {
            const def_meth = values[0], tmpls = values[1], gms = values[2], cmaps = values[3];
            return {
                graphics_methods: gms,
                default_methods: def_meth,
                templates: tmpls,
                colormaps: cmaps
            };
        });
    }
    store = state.then((s) => {
        return createStore(undoableReducer, s, window.devToolsExtension && window.devToolsExtension());
    });
    return store;
}
const getStore = () => {
    return store;
}
export {configureStore, getStore};
