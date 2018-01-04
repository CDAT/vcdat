/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import InfoTab from '../../../../../../src/js/components/modals/CachedFiles/Tabs/InfoTab.jsx'
import { shallow } from 'enzyme'


describe('InfoTabTest.jsx', function() {
    it('renders without exploding', () => {
        const info_tab = shallow(<InfoTab />)
        expect(info_tab).to.have.lengthOf(1);
    });
});