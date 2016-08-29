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

When writing tests for a component, make sure you write the test in the correct directory.
A test for a component should always go into the directory in [test/mocha][testdir] which corresponds to the component's sourcecode origin.
For example, if you were to write a test for Plot



#### Resources

* [Enzyme with Mocha](http://airbnb.io/enzyme/docs/guides/mocha.html)
* [ReactTestUtils](https://facebook.github.io/react/docs/test-utils.html)

[chai]: http://chaijs.com/
[dom-mock]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/dom-mock.js
[mocha]: https://mochajs.org/
[testutils]: https://facebook.github.io/react/docs/test-utils.html
