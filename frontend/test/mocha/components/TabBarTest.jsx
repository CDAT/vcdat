/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import TabBar from '../../../src/js/components/TabBar/TabBar.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'


describe('TabBarTest.jsx', function() {
    it('renders without exploding', () => {
        let spy = sinon.spy()
        const tab_bar = shallow(<TabBar switchTab={spy} selected_tab={0} />)
        expect(tab_bar).to.have.lengthOf(1);
    });

    it('calls switchTab with correct arguments', () => {
        let spy = sinon.spy()
        let tabs = [
            {
                id: "tab0",
                display_name: "Tab0",
            },
            {
                id: "tab1",
                display_name: "Tab1",
                disabled: true,
            },
            {
                id: "tab2",
                display_name: "Tab2",
                disabled: false,
            },
        ]
        const tab_bar = mount(<TabBar tabs={tabs} switchTab={spy} selected_tab={0}/>) // use mount because shallow will allow clicks on disabled el. 
        let tab0 = tab_bar.find(`button#tabbar-${tabs[0].id}`)
        expect(tab0).to.have.lengthOf(1)
        expect(tab0.hasClass("btn-default")).to.be.false
        expect(tab0.hasClass("btn-primary")).to.be.true
        tab0.simulate("click")
        expect(spy.calledWith(0)).to.be.true
        
        let tab1 = tab_bar.find(`button#tabbar-${tabs[1].id}`)
        expect(tab1).to.have.lengthOf(1)
        expect(tab1.hasClass("btn-default")).to.be.true
        expect(tab1.hasClass("btn-primary")).to.be.false // it should not be selected
        tab1.simulate("click")
        expect(spy.calledWith(1)).to.be.false // it should be disabled

        let tab2 = tab_bar.find(`button#tabbar-${tabs[2].id}`)
        expect(tab2).to.have.lengthOf(1)
        expect(tab2.hasClass("btn-default")).to.be.true
        expect(tab2.hasClass("btn-primary")).to.be.false // it should not be selected
        tab2.simulate("click")
        expect(spy.calledWith(2)).to.be.true 

        tab_bar.setProps({selected_tab: 2})

        tab2 = tab_bar.find(`button#tabbar-${tabs[2].id}`)
        expect(tab2).to.have.lengthOf(1)
        expect(tab2.hasClass("btn-default")).to.be.false
        expect(tab2.hasClass("btn-primary")).to.be.true // it should be selected
        tab2.simulate("click")
        expect(spy.calledWith(2)).to.be.true 
    });
});