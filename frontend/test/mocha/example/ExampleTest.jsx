/* globals TestComponent, it, describe, before */
// we need the dom-mock script to build a DOM
var dom_mock = require('../dom-mock');
var jsdom = require('mocha-jsdom');
// we need chai for its various assertion libraries
var chai = require('chai');
var assert = chai.assert;
var React = require('react');
// React's TestUtils allows us to render components and search for them in the mock DOM
var TestUtils = require('react-addons-test-utils');
// To test our component, we have to require the source
var ExampleComponent = require('./Example.jsx').default;

// Mocha's describe() lets us group tests, and name them with descriptive strings
//  This allows us to create testing suites, and pick them out easily in the reporter when we run tests
//  Any describe() block
describe('ExampleTest.jsx : An example React component test', function() {
    // We no longer check for the window since it is set in the mocha arguments '-r jsdom-global/register'
    // jsdom({ skipWindowCheck: false });

    // We also no longer need to build the test dom in every test file. 
    // before(function(){
    //     dom_mock('<html><body></body></html>');
    // });

    // Mocha's it() specifies a test case.
    //  The first argument should be a string that tells what the test does.
    //  The second argument should be a function that ends by with some sort of assertion
    //      about the contents of the component you are testing.
    it('should contain text: TEST', function() {
        // render an instance of <TestComponent /> using TestUtils.renderIntoDocument()
        var myDiv = TestUtils.renderIntoDocument(
            <ExampleComponent />
        );
        // search the document for the previously rendered component, and return its interior 'span' element.
        var divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'span');

        // check to make sure TestComponent rendered <span>TEST</span>, as specified in Example.jsx
        assert.equal(divText.textContent, 'TEST');
      });
});
