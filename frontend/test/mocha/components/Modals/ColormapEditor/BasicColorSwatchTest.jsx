/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import BasicColorSwatch from '../../../../../src/js/components/modals/ColormapEditor/BasicColorSwatch.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'

const basic_color_swatch = shallow(<BasicColorSwatch/>)

describe('BasicColorSwatchTest.jsx', function() {
    it('renders without exploding', () => {
        expect(basic_color_swatch).to.have.lengthOf(1);
    });
});