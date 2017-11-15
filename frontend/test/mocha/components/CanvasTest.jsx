/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
import React from 'react';
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import Canvas from '../../../src/js/components/Canvas.jsx';

const store = createMockStore({})
const props = {
    plots: [
        {
            variables: []
        }
    ]
}
describe('CanvasTest.jsx', function() {
    it('renders without exploding', function() {
        const canvas_comp = shallow(<Canvas store={store} {...props}/>)
        expect(canvas_comp).to.have.lengthOf(1);
    });
});
 