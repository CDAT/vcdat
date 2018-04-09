/* globals it, describe, before, beforeEach, */
// React has to be in scope when testing
var React = require('react')
// chai gives us various assertion tools like assert, and expect
var chai = require('chai')
var expect = chai.expect;

// Enzyme provides various testing facilities including shallow rendering a component
// Shallow rending helps ensure that unit tests only test the top level component in the render tree
import Enzyme from 'enzyme'
// Enzyme needs an adapter to connect interface with our version of react
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
// And of course we have to import the component we are testing
import ExampleComponent from './ExampleComponent.jsx'



// Mocha's describe() lets us group tests, and name them with descriptive strings
//  This allows us to create testing suites, and pick them out easily in the reporter when we run tests
//  Any describe() block
describe('ExampleTest.jsx : An example React component test', function() {
    // We no longer check for the window since it is set in the mocha arguments '-r jsdom-global/register'
    // jsdom({ skipWindowCheck: false });

    // We also no longer need to build the test dom in every test file. 
    // before(function(){
    //     dom_mock('<html><body></body></html>');
    // });

    // Mocha's it() specifies a test case.
    //  The first argument should be a string that tells what the test does.
    //  The second argument should be a function that ends by with some sort of assertion
    //      about the contents of the component you are testing.
    it('Renders without exploding', function() {
        // enzyme's shallow will return a component that is wrapped with various enzyme functions
        const wrapper = shallow(<ExampleComponent />)
        // Check that the component rendered
        expect(wrapper).to.have.lengthOf(1);
    })

    it('sayHello returns "Hello"', function() {
        // We can access the component by calling wrapper.instance()
        const wrapper = shallow(<ExampleComponent />)
        // Check that a function works
        expect(wrapper.instance().sayHello()).to.equal("Hello")
        
        // Enzyme has functions for finding dom elements just like jQuery, and can simulate events as well
        // wrapper.find(#my-button).simulate("click")
    })
});
