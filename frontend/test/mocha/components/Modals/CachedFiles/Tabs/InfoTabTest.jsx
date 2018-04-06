/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import InfoTab from '../../../../../../src/js/components/modals/CachedFiles/Tabs/InfoTab.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'

describe('InfoTabTest.jsx', function() {
    it('renders without exploding', () => {
        const info_tab = shallow(<InfoTab />)
        expect(info_tab).to.have.lengthOf(1);
    });

    it('Calls onTryClose prop', () => {
        let spy = sinon.spy()
        const info_tab = shallow(<InfoTab onTryClose={spy}/>)
        info_tab.find("#infotab-close").simulate("click")
        expect(spy.calledOnce).to.be.true
    });
});