/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
var Toolbar= require('../../../src/js/components/Toolbar.jsx').default;
import { shallow } from 'enzyme'

describe('toolbarTest.jsx', function() {
    it('renders without exploding', () => {
        const wrapper = shallow(<Toolbar/>)
        expect(wrapper).to.have.lengthOf(1);
    });

    // it('Renders a div named "toolbar"', function() {
    //     var toolbar = TestUtils.renderIntoDocument(
    //         <Toolbar/>
    //     );
    //     var toolbar_div = TestUtils.scryRenderedDOMComponentsWithClass(toolbar, 'toolbar');
    //     expect(toolbar_div).to.exist;
    // });
});
