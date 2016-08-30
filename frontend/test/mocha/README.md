# Testing vCDAT

#### Table of Contents

* [Running Tests](#running-tests)
* [Developing Tests](#developing-tests)
    * [Testing Stack](#vcdats-testing-stack)
    * [Naming Convention](#directory-structure-and-naming)
* [Resources](#resources)


## Running tests

To run the current official test suite, simply type ```npm test```.
This will run Mocha, with all of the necessary options to test the existing tests for vCDAT.

If you wish to run tests on specific files, you'll need to consult [Mocha's documentation][mocha-cli].
I will provide a few simple examples of how to use Mocha's CLI here.

```mocha test/mocha/ -g '.*Test.js[x]*' --compilers jsx:babel-core/register --recursive```
This is the current default configuration that gets run when you type ```npm test```.
It is necessary to specify that we want to use the babel compiler, because we are utilizing JSX syntax.
The '-g' option tells mocha to only run tests whose names match the given pattern. By convention, all of our
React component and Javascript tests follow naming guidelines which ensures that they will be caught by this
expression.

Some options that you can specify with mocha are the [Reporter][mocha-reporter]

## Developing tests

### vCDAT's testing stack

We use [Mocha][mocha], [Chai][chai], [ReactTestUtils][test-utils], and [JSDom][jsdom] to test our application.

As a React app, vCDAT has some things that need to be set up in order to get up and running with tests.
To test components, we need a mock DOM into which we can render the test components. For this purpose, we include [JSDOM][jsdom], and have a simple [dom-mock.js][dom-mock] script that we run before we render a new react component.

Also, because we use JSX syntax, we need to execute a transpilation step with [Babel][babel] when we run our tests.

I will go over directory structure, how to write tests, and some brief examples in the following sections.

### Directory structure and naming

All of vCDAT's tests are located in [vcdat/frontend/test/mocha][test-dir].
Under this directory there are subdirectories for each type of Javascript/React component source in our project
(actions, components, containers, and a special directory for the top-level App.js and Store.js files, called 'app').

Make sure to adhere to the following guidelines when writing your tests:

* When writing tests for a component, make sure you write the test in the correct directory.
    * The directory in [test/mocha/][test-dir] should correspond to the component's sourcecode origin.
* Test name should be CapitalCase, with the source name of the Javascript being tested, followed by the word 'Test'.
* For example, if you were to write a test for [src/js/components/Plotter.jsx][plotter],
    * You should place this test in [mocha/test/components][components]
    * The test should be called 'PlotterTest.jsx'



#### Resources

* [Chai][chai]
* [Enzyme with Mocha](http://airbnb.io/enzyme/docs/guides/mocha.html)
* [Mocha][mocha]
* [ReactTestUtils](https://facebook.github.io/react/docs/test-utils.html)

[babel]:
[chai]: http://chaijs.com/
[components]:
[dom-mock]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/dom-mock.js
[jsdom]:
[mocha]: https://mochajs.org/
[mocha-cli]: https://mochajs.org/#usage
[plotter]:
[test-dir]: https://github.com/embrown/vcdat/blob/master/frontend/test/mocha/
[test-utils]: https://facebook.github.io/react/docs/test-utils.html
