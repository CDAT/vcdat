/* globals it, describe, before, beforeEach, */
var dom_mock = require('../dom-mock');
var jsdom = require('mocha-jsdom');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Toolbar= require('../../../src/js/components/Toolbar.jsx').default;


describe('toolbarTest.jsx', function() {
    jsdom({ skipWindowCheck: false });
    before(function(){
        dom_mock('<html><body></body></html>');
    });

    it('Renders a div named "toolbar"', function() {
        var toolbar = TestUtils.renderIntoDocument(
            <Toolbar/>
        );
        var toolbar_div = TestUtils.scryRenderedDOMComponentsWithClass(toolbar, 'toolbar');
        expect(toolbar_div).to.exist;
    });
});
