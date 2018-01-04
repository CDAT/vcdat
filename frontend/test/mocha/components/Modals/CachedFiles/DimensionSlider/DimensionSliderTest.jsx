/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import DimensionSlider from '../../../../../../src/js/components/modals/CachedFiles/DimensionSlider/DimensionSlider.jsx'
import { shallow } from 'enzyme'


describe('DimensionSliderTest.jsx', function() {
    it('renders without exploding', () => {
        let props = {
            data: [0]
        }
        const dimension_slider = shallow(<DimensionSlider {...props}/>)
        expect(dimension_slider).to.have.lengthOf(1);
    });
});