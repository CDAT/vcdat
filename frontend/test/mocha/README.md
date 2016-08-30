# Testing vCDAT

#### Table of Contents

* [Resources](#resources)

## vCDAT's testing stack

We use [Mocha][mocha], [Chai][chai], [ReactTestUtils][testutils], and [JSDom][jsdom] to test our application.

As a React app, vCDAT has some things that need to be set up in order to get up and running with tests.
To test components, we need a mock DOM into which we can render the test components. For this purpose, we include [JSDOM][jsdom], and have a simple [dom-mock.js][dom-mock] script that we run before we render a new react component.

Also, because we use JSX syntax, we need to execute a transpilation step with [Babel][babel] when we run our tests.

I will go over directory structure, how to write tests, and some brief examples in the following sections.

## Directory structure and naming convention

All of vCDAT's tests are located in [vcdat/frontend/test/mocha][testdir]. Under this directory there are subdirectories for each type of Javascript/React component source in our project (actions, components, containers, and a special directory for the top-level App.js and Store.js files, called 'app').

Make sure to adhere to the following guidelines when writing your tests:

* When writing tests for a component, make sure you write the test in the correct directory.
* * The directory in [test/mocha/][testdir] should correspond to the component's sourcecode origin.
* Test name should be CapitalCase, with the source name of the Javascript being tested, followed by the word 'Test'.
* For example, if you were to write a test for [src/js/components/Plotter.jsx][plotter],
* * You should place this test in [mocha/test/components][components]
* * The test should be called 'PlotterTest.jsx'



#### Resources

* [Enzyme with Mocha](http://airbnb.io/enzyme/docs/guides/mocha.html)
* [ReactTestUtils](https://facebook.github.io/react/docs/test-utils.html)

[chai]: http://chaijs.com/
[components]:
[dom-mock]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/dom-mock.js
[mocha]: https://mochajs.org/
[plotter]:
[testutils]: https://facebook.github.io/react/docs/test-utils.html
