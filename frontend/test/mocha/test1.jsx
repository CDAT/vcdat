// Mocking window and document object:
/* globals TestComponent, it, describe*/
var dom_mock = require('./dom-mock');

var jsdom = require('mocha-jsdom');
var assert = require('assert');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var TestComponent = require('./TestComponent.jsx').default;

beforeEach(function(){
    dom_mock('<html><body></body></html>');
});

describe('Testing my div', function() {
  jsdom({ skipWindowCheck: false });

  it('should contain text: TEST', function() {
    var myDiv = TestUtils.renderIntoDocument(
      <TestComponent />
    );
    var divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'span');

    assert.equal(divText.textContent, 'TEST');
  });
});
