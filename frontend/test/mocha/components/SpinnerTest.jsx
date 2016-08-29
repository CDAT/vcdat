// Mocking window and document object:
/* globals it, describe, beforeEach */
var dom_mock = require('../dom-mock');
var jsdom = require('mocha-jsdom');
var chai = require('chai');
var expect = chai.expect
var assert = chai.assert;
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Spinner = require('../../../src/js/components/Spinner.jsx').default;

beforeEach(function(){
    dom_mock('<html><body></body></html>');
});

describe('Testing Spinner.jsx ...', function() {
    jsdom({ skipWindowCheck: false });

    it('Renders a div named "spinner"', function() {
        var spinner = TestUtils.renderIntoDocument(
            <Spinner min='1' max='4' value='1' update='true' />
        );
        var spinner_div = TestUtils.scryRenderedDOMComponentsWithClass(spinner, 'spinner');
        expect(spinner_div).to.exist;
    });
});
