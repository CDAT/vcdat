# Testing vCDAT

##### Table of Contents

* [Running Tests](#running-tests)
* [Developing Tests](#developing-tests)
    * [Testing Stack](#vcdats-testing-stack)
    * [Naming Convention](#directory-structure-and-naming)
    * [Writing Tests](#writing-tests)
    * [Overview of Testing Tools](#testing-tools)
        * [Mocha](#mocha)
            * [describe](#describe)
            * [it](#it)
            * [Hooks](#hooks)
        * [Chai]
            * [assert](#assert)
            * [expect](#expect)
            * [should](#should)
        * [React TestUtils](#testutils)


## Running tests

To run the current official test suite, simply type ```npm test``` in the terminal, anywhere under the frontend
directory.
This will run Mocha, with all of the necessary options to run the existing tests for vCDAT.

If you wish to run tests on specific files, you'll need to consult [Mocha's documentation][mocha-cli].
I will provide a few simple examples of how to use Mocha's CLI here.

```mocha test/mocha/ -g '.*Test.js[x]*' --compilers jsx:babel-core/register --recursive```
This is the current default configuration that gets run when you type ```npm test```.
It is necessary to specify that we want to use the babel compiler, because we are utilizing JSX syntax.
The '-g' option tells mocha to only run tests whose names match the given pattern. By convention, all of our
React component and Javascript tests follow naming guidelines which ensures that they will be caught by this
expression.

Some options that you can specify with mocha are:
* [The reporter][mocha-reporter], which specifies how the test results will be output
*

## Developing tests

### vCDAT's testing stack

We use [Mocha][mocha], [Chai][chai], [ReactTestUtils][test-utils], and [JSDom][jsdom] to test our application.
We will also possibly include other tools, such as [Airbnb's Enzyme][enzyme] in the future.

As a React app, vCDAT has some things that need to be set up in order to get up and running with tests.
To test components, we need a mock DOM into which we can render the test components. For this purpose, we include [JSDOM][jsdom], and have a simple [dom-mock.js][dom-mock] script that we run before we render a new react component.

Also, because we use JSX syntax, we need to execute a transpilation step with [Babel][babel] when we run our tests.

I will go over directory structure, how to write tests, and a brief overview of [Mocha][local-mocha],
[Chai][local-chai], and [ReactTestUtils][local-test-utils] in the following sections.

### Directory structure and naming

All of vCDAT's tests are located in [vcdat/frontend/test/mocha][test-dir].
Under this directory there are subdirectories for each type of Javascript/React component source in our project
([actions][test-actions], [components][test-components], [containers][test-containers], and a special directory for
the top-level App.js and Store.js files, called [app][test-app]).

Make sure to adhere to the following guidelines when writing your tests:

* When writing tests for a component, make sure you write the test in the correct directory.
    * The directory in [test/mocha/][test-dir] should correspond to the component's sourcecode origin.
* Test name should be CapitalCase, with the source name of the Javascript being tested, followed by the word 'Test'.
* Inside the .jsx test file, the root level describe() block should contain the file name in its description string.
* For example, if you were to write a test for [src/js/components/Plotter.jsx][plotter],
    * You should place this test in [mocha/test/components][components]
    * The test should be called ```PlotterTest.jsx```
    * The root level describe would be ```describe('PlotterTest.jsx ...', function(){...})```
        * This ensures that the default test runner will find your tests
        * You can add more to the root describe string, as long as it contains the file name

### Writing tests

To explain test writing, I will review [Example.jsx][example-jsx] and [ExampleTest.jsx][example-test-jsx],
which I wrote to make sure that our environment was set up correctly to test React components.
If you get lost while reading this guide, try following along with the code and comments in
[ExampleTest][example-test-jsx].

The [Example][example-jsx] component is extremely simple. When an ```<Example />``` component is rendered into the
DOM, it gets replaced with ```<div class='test'><span>TEST</span></div>```.

To test a react component, we have to import several libraries and other Javascript files:
* [dom-mock.js][dom-mock] allows us to buld a fake DOM into which we can render react components
* [jsdom][jsdom] must be imported before React so TestUtils can use DOM objects and methods
* [chai][local-chai] lets us use functions like 'assert' and 'expect' to test our rendered html
* Obviously, React needs to be loaded to run React code
* [TestUtils][local-test-utils] is React's library for testing React components
* Finally, we have to import the component we are testing

After we have all the correct libraries and files imported, there are three essential things we need to make a test.
* a [describe()](#describe) block, which lets us group our tests
* a [before()](#hooks) block, which we use to create a mock DOM before rendering the components
* and an [it()](#it) block, which contains the test

After that, all that's left to do is use [TestUtils][local-test-utils] to render the React component in the DOM,
pull that component out of the DOM, and test it with an assert.
When we run ```npm test```, mocha will let us know if it gets any errors while running our test.

### Testing Tools

#### Mocha

##### describe

Mocha's ```describe()``` function allows us to group tests into their own suites. This makes it easy to separate
concerns, and provides a simple way of running specific tests via Mocha's CLI.
```describe()``` blocks can be arbitrarily nested, allowing for separation of suites into sub-suites.
```javascript
describe('My_test_suite', function(){
    // ... testing goes here
    describe('A subset of My_test_suite', function(){
        // ... more specific tests here
    });
});
```

##### it

```it()``` blocks contain individual tests in your test suite. They are provided with a string for description,
and a function which runs the test. Generally, the description string should say something about what the result of
the test should be.

```javascript
describe('suite', function(){
    it('should fail', function(){
        assert(false);
    })
})
```
##### Hooks

[Hooks][mocha-hooks] are functions that let you run a block of code before or after a function, or a number
of functions, in your test suites. These hooks include ```before()```, ```beforeEach()```, ```after()```, and
```afterEach()```. These hooks can be invoked with a description, or with named functions, to help with pinpointing
errors. They can also be invoked asynchronously.

```javascript
beforeEach('Hooks examples setup', function(){
    // will run before every function following
});
describe('Hooks example', function(){
    before('sub_suite1 setup', function(){
        // will run before sub_suite1 begins
    });
    describe('sub_suite1', function(){
        afterEach('ss1 cleanup', function(){
            // will run after each test in this describe block
        });
        it('test1', function(){
        });
        after('test2 extra cleanup', function(){
            // will only run after test2
        });
        it('test2', function(){
        });
    });
});
```
For more information, refer to [Mocha's documentation][mocha-hooks]

#### Chai

##### assert

Chai expands on Node's assert library. See the [full API][chai-assert-api] for more information.
Example from [Chai's documentation][chai-assert]:
```javascript
var assert = require('chai').assert
var foo = 'bar'
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

assert.typeOf(foo, 'string'); // without optional message
assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
assert.equal(foo, 'bar', 'foo equal `bar`');
assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
```

##### expect

```expect()``` is one of Chai's [BDD-style assert APIs][chai-bdd-api].
Example from [Chai's documentation][chai-expect]:
```javascript
var expect = require('chai').expect
var foo = 'bar'
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.length(3);
expect(beverages).to.have.property('tea').with.length(3);
```

##### should

```should()``` is the other of Chai's [BDD-style assert APIs][chai-bdd-api].
Example from [Chai's documentation][chai-should]:
```javascript
var should = require('chai').should() //actually call the function
var foo = 'bar'
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.length(3);
beverages.should.have.property('tea').with.length(3);
```

#### TestUtils

React's [TestUtils][test-utils] library allows us to create React components in a mocked DOM, simulate events on
DOM elements, and all sorts of other handy things.
To be able to use this library, you will need to have [jsdom][jsdom] included before React in your test file.

A basic example of how we use TestUtils:
```javascript
before(function(){
    dom_mock('<html><body></body></html>');
});

var myDiv = TestUtils.renderIntoDocument(
    <ExampleComponent />
);

var divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'span');
```
Check out the official [documentation][test-utils] for more information.

[babel]: https://babeljs.io/docs/plugins/preset-react/
[chai]: http://chaijs.com/
[chai-assert]: http://chaijs.com/guide/styles/#assert
[chai-assert-api]: http://chaijs.com/api/assert/
[chai-bdd-api]: http://chaijs.com/api/bdd/
[chai-expect]: http://chaijs.com/guide/styles/#expect
[chai-should]: http://chaijs.com/guide/styles/#should
[components]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/components
[dom-mock]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/dom-mock.js
[enzyme]: http://airbnb.io/enzyme/
[enzyme-mocha]: http://airbnb.io/enzyme/docs/guides/mocha.html
[example-jsx]: https://github.com/embrown/vcdat/tree/master/frontend/test/mocha/example/Example.jsx
[example-test-jsx]: https://github.com/embrown/vcdat/tree/master/frontend/test/mocha/example/ExampleTest.jsx
[jsdom]: https://github.com/tmpvar/jsdom
[mocha]: https://mochajs.org/
[mocha-cli]: https://mochajs.org/#usage
[mocha-hooks]: https://mochajs.org/#hooks
[mocha-reporter]: https://mochajs.org/#reporters
[plotter]: https://github.com/embrown/vcdat/blob/master/frontend/src/js/components/Plotter.jsx
[test-actions]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/actions
[test-app]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/app
[test-components]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/components
[test-containers]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/containers
[test-dir]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/
[test-utils]: https://facebook.github.io/react/docs/test-utils.html
