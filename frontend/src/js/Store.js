import { createStore } from 'redux'
import undoableReducer from './reducers/Reducer.js'


export default function configureStore(initialState = {}){
    return createStore(undoableReducer, initialState,
        window.devToolsExtension && window.devToolsExtension()
    );
}
