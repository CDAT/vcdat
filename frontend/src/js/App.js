import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './containers/AppContainer.jsx'
import {configureStore} from './Store.js'
import {Provider} from 'react-redux'

let s = configureStore();

(function($) {
    $(document).ready(() => {
        $(".btn").mouseup(function() {
            $(this).blur();
        })
    })
})(jQuery);

(function(jQuery) {
    jQuery.expr[':'].regex = function(elem, index, match) {
        var matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
                method: matchParams[0].match(validLabels)
                    ? matchParams[0].split(':')[0]
                    : 'attr',
                property: matchParams.shift().replace(validLabels, '')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        return regex.test(jQuery(elem)[attr.method](attr.property));
    }
}(jQuery));

s.then((store) => {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer/>
        </Provider>,
        document.getElementById('app')
    );
});
