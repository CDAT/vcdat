/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import TabBar from '../../../../../../src/js/components/modals/CachedFiles/Tabs/TabBar.jsx'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'


describe('TabBarTest.jsx', function() {
    it('renders without exploding', () => {
        const tab_bar = shallow(<TabBar />)
        expect(tab_bar).to.have.lengthOf(1);
    });

    it('calls switchTab with correct arguments', () => {
        let spy = sinon.spy()
        const tab_bar = mount(<TabBar switchTab={spy}/>) // use mount because shallow will allow clicks on disabled el. 
        tab_bar.find('#tabbar-file').simulate("click")
        expect(spy.calledWith("file")).to.be.true

        tab_bar.find('#tabbar-esgf').simulate("click")
        expect(spy.calledWith("esgf")).to.be.false // Switch .false to .true when implimented

        tab_bar.find('#tabbar-opendap').simulate("click")
        expect(spy.calledWith("opendap")).to.be.false  // Switch .false to .true when implimented

        tab_bar.find('#tabbar-info').simulate("click")
        expect(spy.calledWith("info")).to.be.true
        
    });
});