import undoable, { distinctState, combineFilters, excludeAction } from 'redux-undo'
import { combineReducers } from 'redux'
const GoldenLayout = require('imports?React=react&ReactDOM=react-dom!golden-layout')

var default_config = {
            content: [
                {
                    type: 'stack',
                    content: [
                        {
                            type: 'stack',
                            title: 'Sheet 1',
                            content: [
                                {
                                    title: 'component A 1',
                                    type: 'react-component',
                                    component: 'test-component'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

var div = document.getElementById('spreadsheet-div');
var default_state = {
    layout: {},
    config:default_config
}

const projectReducer = (state = default_state, action) => {
    switch(action.type){
        case 'LAYOUT_INITIALIZED':
            var new_state = jQuery.extend(true, {}, state, {layout: action.layout});
            console.log('layout initted', new_state)
            return new_state;
        case 'ADD_ITEM':
            console.log('adding item', action.item);
            var new_layout = jQuery.extend(true, {}, state.layout);
            console.log('new lay', new_layout);
            new_layout.root.contentItems[0].addChild(action.item);
            var new_state = jQuery.extend(true, {}, state, {layout: new_layout});
            console.log('new state', new_state);
            return new_state
        default:
            return state;
    }
}


const reducers = combineReducers({
    projects: projectReducer
})

const undoableReducer = undoable(reducers,{
    filter: excludeAction(['CHANGE_VISIBILITY'])
})

export default undoableReducer
