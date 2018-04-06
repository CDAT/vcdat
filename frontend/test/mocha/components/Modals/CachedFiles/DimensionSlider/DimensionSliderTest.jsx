/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import DimensionSlider from '../../../../../../src/js/components/modals/CachedFiles/DimensionSlider/DimensionSlider.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'


describe('DimensionSliderTest.jsx', function() {
    it('Renders without exploding', () => {
        let props = {
            data: [0]
        }
        const dimension_slider = shallow(<DimensionSlider {...props}/>)
        expect(dimension_slider).to.have.lengthOf(1);
    });

    it('Selects lower bound', () => {
        let spy = sinon.spy()
        let props = {
            data: [0,1,2,3,4,5,6,7,8,9]
        }
        const dimension_slider = mount(<DimensionSlider {...props} onChange={spy}/>)
        dimension_slider.setState({
            value: [0, 9]
        })
        expect(spy.callCount).to.equal(1)
        dimension_slider.find("#dimension-slider-select-lower").simulate("change", {
            target: {
                value: 2
            }
        })
        expect(dimension_slider.state().value[0]).to.equal(2)
        expect(spy.callCount).to.equal(2)
    });

    it('Selects upper bound', () => {
        let spy = sinon.spy()
        let props = {
            data: [0,1,2,3,4,5,6,7,8,9]
        }
        const dimension_slider = mount(<DimensionSlider {...props} onChange={spy}/>)
        dimension_slider.setState({
            value: [0, 9]
        })
        expect(spy.callCount).to.equal(1)
        dimension_slider.find("#dimension-slider-select-upper").simulate("change", {
            target: {
                value: 8
            }
        })
        expect(dimension_slider.state().value[1]).to.equal(8)
        expect(spy.callCount).to.equal(2)
    });

    it('Selects stride', () => {
        let spy = sinon.spy()
        let props = {
            data: [0,1,2,3,4,5,6,7,8,9]
        }
        const dimension_slider = mount(<DimensionSlider {...props} onChange={spy}/>)
        dimension_slider.setState({
            value: [0, 9]
        })
        expect(spy.callCount).to.equal(1)
        dimension_slider.find(".stride FormControl").simulate("change", {
            target: {
                value: 2
            }
        })
        expect(spy.called).to.be.true
        expect(dimension_slider.state().stride).to.equal(2)
    });
});