import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './containers/AppContainer.jsx'
import configureStore from './Store.js'
import { Provider } from 'react-redux'

let store = configureStore();

// $('body').click(() => {
//     console.log('clicked')
//     $('#spreadsheet-div').trigger('unselected');
// })

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
document.getElementById('app'));
