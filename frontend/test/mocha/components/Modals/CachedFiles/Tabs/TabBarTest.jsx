/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import TabBar from '../../../../../../src/js/components/modals/CachedFiles/Tabs/TabBar.jsx'
import { shallow } from 'enzyme'


describe('TabBarTest.jsx', function() {
    it('renders without exploding', () => {
        const tab_bar = shallow(<TabBar />)
        expect(tab_bar).to.have.lengthOf(1);
    });
});