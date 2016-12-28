import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { createStore, combineReducers } from 'redux'
import CachedFileModel from './models/CachedFiles.js';
import ColormapModel from './models/Colormaps.js';
import GraphicsMethodModel from './models/GraphicsMethods.js';
import TemplateModel from './models/Templates.js';
import VariableModel from './models/Variables.js';
import SpreadsheetModel from './models/Spreadsheet.js';

/* global $ */

// combined reducers + undoable
const reducers = combineReducers({
    cached_files: CachedFileModel.reduce,
    variables: VariableModel.reduce,
    graphics_methods: GraphicsMethodModel.reduce,
    templates: TemplateModel.reduce,
    sheets_model: SpreadsheetModel.reduce,
    colormaps: ColormapModel.reduce
});

const undoableReducer = undoable(reducers,{
    filter: excludeAction(
        ['CHANGE_CUR_SHEET_INDEX', 'INITIALIZE_TEMPLATE_VALUES',
        'INITIALIZE_GRAPHICS_METHODS_VALUES', 'INITIALIZE_COLORMAPS',
        'INITIALIZE_DEFAULT_METHODS','ADD_FILE_TO_CACHE']
    )
});

var store = null;
const configureStore = (initialState = {}) => {
    let state = Promise.resolve(initialState);
    if (Object.keys(initialState).length === 0) {
        const models = [CachedFileModel, VariableModel, GraphicsMethodModel, TemplateModel, SpreadsheetModel, ColormapModel]
        const initialStates = models.map((m) => {
            return m.getInitialState();
        });
        state = Promise.all(initialStates).then((values) => {
            const cached_files = values[0], variables = values[1], graphics_methods = values[2], templates = values[3], sheets_model = values[4], colormaps = values[5];
            return {
                present: {
                    cached_files,
                    variables,
                    graphics_methods,
                    templates,
                    sheets_model,
                    colormaps
                },
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
