/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _list = __webpack_require__(1);
	
	var _list2 = _interopRequireDefault(_list);
	
	var _input = __webpack_require__(2);
	
	var _input2 = _interopRequireDefault(_input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Container = React.createClass({
	    displayName: 'Container',
	    getInitialState: function getInitialState() {
	        return this.state = {
	            'todo_items': ['groceries', 'apples']
	        };
	    },
	    render: function render() {
	        console.log('list', _list2.default);
	        console.log('state items', this.state.todo_items);
	        return;
	        React.createElement(
	            'div',
	            null,
	            React.createElement('search', { id: 'search', enterPressed: this.addNewItem }),
	            React.createElement('todo_list', { items: this.state.todo_items })
	        );
	
	        // return React.createElement('div', {}, React.createElement(search, {
	        //         'enter_pressed': this.addNewItem,
	        //         'input_text': this.state.input_text
	        //     }),
	        //     React.createElement(todo_list, {
	        //         'items': this.state.todo_items
	        //     })
	        // )
	    },
	
	
	    addNewItem: function addNewItem(val) {
	        console.log('enter pressed');
	        var items = this.state.todo_items;
	        items.push(val);
	        this.setState({ 'todo_items': items });
	        console.log('container state', this.state);
	    }
	
	});
	
	ReactDOM.render(React.createElement(Container, null), document.getElementById('react-app'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var todo_list = React.createClass({
	    displayName: 'todo_list',
	    render: function render() {
	        console.log('list-props', this.props);
	        return React.createElement('ul', {}, this.props.items.map(function (value, index) {
	            console.log('adding item', value);
	            return React.createElement('li', { key: value }, value);
	        }));
	    }
	});
	
	module.exports = todo_list;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var search = React.createClass({
	    displayName: "search",
	    handleKeyPress: function handleKeyPress(e) {
	        if (e.keyCode === 13) {
	            e.preventDefault;
	            var value = this.refs.todo_input.value;
	            this.props.enterPressed(value);
	        }
	    },
	
	    render: function render() {
	        return React.createElement('div', {
	            className: "row text-center",
	            id: "search"
	        }, React.createElement('input', {
	            onKeyUp: this.handleKeyPress,
	            ref: 'todo_input'
	        }));
	    }
	});
	
	module.exports = search;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map