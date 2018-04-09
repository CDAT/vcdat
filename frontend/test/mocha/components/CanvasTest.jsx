/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import Canvas from '../../../src/js/components/Canvas.jsx'
const store = createMockStore({
    present: {
        graphics_methods: {
            "boxfill": {
                "default": {}
            }
        }
    }
})

function getProps(){
    return {
        plots: [{
            graphics_method_parent: "boxfill",
            graphics_method: "default",
            variables: []
        }],
        onTop: false,
        can_plot: false,
    }
}

describe('CanvasTest.jsx', function() {
    it('Renders without exploding', function() {
        const canvas = shallow(<Canvas store={store} {...getProps()}/>)
        expect(canvas).to.have.lengthOf(1);
    });

    it('Should update only when required', function() {
        let props = getProps()
        let identical_props = getProps()
        var canvas = shallow(<Canvas store={store} {...props}/>).dive() // dive gives us the Canvas component instead of the redux wrapper
        let next_props = getProps()
        next_props.onTop = true
        expect(canvas.instance().shouldComponentUpdate(identical_props)).to.be.false // same props, no need to render
        expect(canvas.instance().shouldComponentUpdate(next_props)).to.be.true // onTop changed, need to render

        next_props = getProps()
        next_props.can_plot = true
        expect(canvas.instance().shouldComponentUpdate(next_props)).to.be.false // on top is false, we could render but shouldn't since the canvas is not visible

        props = getProps()
        props.can_plot = true
        props.onTop = true
        props.variables = ["clt"]
        canvas = shallow(<Canvas store={store} {...props}/>).dive()
        next_props = getProps()
        next_props.variables = ["changed"] // simulate changing a variable
        expect(canvas.instance().shouldComponentUpdate(next_props)).to.be.true // new variable, and we can plot. Need to render
    });
});
 