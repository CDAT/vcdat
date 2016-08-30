/* globals it, describe, before, beforeEach, */
var dom_mock = require('../dom-mock');
var jsdom = require('mocha-jsdom');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Animation= require('../../../src/js/components/Animation.jsx').default;


describe('Testing Animation.jsx ...', function() {
    jsdom({ skipWindowCheck: false });
    before(function(){
        dom_mock('<html><body></body></html>');
    });

    it('Renders a div named "animation"', function() {
        var animation = TestUtils.renderIntoDocument(
            <Animation />
        );
        var animation_div = TestUtils.scryRenderedDOMComponentsWithClass(animation, 'animation');
        expect(animation_div).to.exist;
    });
});
