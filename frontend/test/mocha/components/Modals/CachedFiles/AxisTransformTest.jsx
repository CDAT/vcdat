/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import AxisTransform from '../../../../../src/js/components/modals/CachedFiles/AxisTransform.jsx'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

describe('AxisTransformTest.jsx', function() {
    it('Renders without exploding', () => {
        const props = {
            axis_name: "latitude",
            axis_transform: "def",
            handleAxisTransform: sinon.spy(),
        }
        const axis_transform = shallow(<AxisTransform {...props}/>)
        expect(axis_transform).to.have.lengthOf(1)
    });

    it('Calls its onSelect handler', () => {
        const props = {
            axis_name: "latitude",
            axis_transform: "avg",
            handleAxisTransform: sinon.spy(),
        }
        const axis_transform = mount(<AxisTransform {...props}/>)
        axis_transform.find(`.dropdown ul.dropdown-menu li a`).first().simulate("click")
        expect(props.handleAxisTransform.called).to.be.true
        expect(props.handleAxisTransform.getCall(0).args[0]).to.equal("latitude")
        expect(props.handleAxisTransform.getCall(0).args[1]).to.equal("def")
    });
});