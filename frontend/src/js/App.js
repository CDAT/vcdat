import React from 'react'
import ReactDOM from 'react-dom'
import SpreadsheetContainer from './containers/SpreadsheetContainer.jsx'
import configureStore from './Store.js'
import { Provider } from 'react-redux'

let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <SpreadsheetContainer />
    </Provider>,
document.getElementById('app'));
