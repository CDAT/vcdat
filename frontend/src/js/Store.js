import { createStore } from 'redux'
import undoableReducer from './reducers/Reducer.js'

var store;
const configureStore = (initialState = {}) => {
    store = createStore(undoableReducer, initialState,
        window.devToolsExtension && window.devToolsExtension()
    );
    return store;
}
const getStore = () => {
    return store;
}
export {configureStore, getStore};
