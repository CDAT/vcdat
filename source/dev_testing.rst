=============
Testing vCDAT
=============

Running tests
-------------

To run the current official test suite, simply type ``npm test`` in the
terminal, anywhere under the frontend directory. This will run Mocha,
with all of the necessary options to run the existing tests for vCDAT.

If you wish to run tests on specific files, you'll need to consult
`Mocha's documentation <https://mochajs.org/#usage>`__. I will provide a
simple example of how to use Mocha's CLI here.

``mocha test/mocha/ -g '.*Test.js[x]*' --compilers jsx:babel-core/register --recursive``

This is the current default configuration that gets run when you type
``npm test``. It is necessary to specify that we want to use the babel
compiler, because we are utilizing JSX syntax. The '-g' option tells
mocha to only run tests whose names match the given pattern. By
convention, all of our React component and Javascript tests follow
naming guidelines which ensures that they will be caught by this
expression.

Code coverage
-------------

We generate code coverage using `Babel's istanbul
plugin <https://github.com/istanbuljs/babel-plugin-istanbul>`__ along
with `istanbul nyc <https://github.com/istanbuljs/nyc>`__. This runs on
top of our ``npm test`` script. The combination is great, because
babel-istanbul utilizes babel and webpack, which we already use for
building vCDAT, and nyc eliminates the need for hooking our mocha tests
into a karma test runner, thus avoiding a boatload of extra
dependencies.

We have an npm script set up for code coverage, so run
``npm run coverage`` to see our current test coverage info.

If you want to run it by hand, make sure to change the NODE_ENV to test
mode, and run the mocha tests through nyc:

``NODE_ENV=test nyc [nyc_opts] mocha [mocha-opts]``

Developing tests
----------------

.. _vcdat's-testing-stack:

vCDAT's testing stack
~~~~~~~~~~~~~~~~~~~~~

We use `Enzyme <http://airbnb.io/enzyme/>`__, `Mocha <https://mochajs.org/>`__, and `Chai <http://chaijs.com/>`__,
to test our application.

Most components should be tested using Enzyme's 'shallow' method which does not 
require a DOM mock, and isolates the rendering to the top level component. This helps
assure that our tests are focused on verifying a single component and
not their child components. If a component relies on lifecycle methods that shallow does not support,
or parts of the DOM that shallow does not emulate, use Enzyme's 'mount' method. 

Also, because we use JSX syntax, we need to execute a transpilation step
with `Babel <https://babeljs.io/docs/plugins/preset-react/>`__ when we
run our tests. This is handled via the compiler flag inside the npm test
script.

I will go over directory structure, how to write tests, and a brief
overview of Enzyme, Mocha, and Chai in the following sections.

Directory structure and naming
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

All of vCDAT's tests are located in
`vcdat/frontend/test/mocha <https://github.com/CDAT/vcdat/tree/master/frontend/test/mocha/>`__.

Make sure to adhere to the following guidelines when writing your tests:

-  When writing tests for a component, make sure you write the test in
   the correct directory.

   -  The directory in
      `test/mocha/ <https://github.com/CDAT/vcdat/tree/master/frontend/test/mocha/>`__
      should correspond to the component's sourcecode origin.

-  Test name should be CapitalCase, with the source name of the
   Javascript being tested, followed by the word 'Test'.
-  Inside the .jsx test file, the root level describe() block should
   contain the file name in its description string.
-  For example, if you were to write a test for
   `src/js/components/Plotter.jsx <https://github.com/CDAT/vcdat/tree/master/frontend/src/js/components/Plotter.jsx>`__,

   -  You should place this test in
      `mocha/test/components <https://github.com/CDAT/vcdat/tree/master/frontend/test/mocha/components>`__
   -  The test should be called ``PlotterTest.jsx``
   -  The root level describe would be
      ``describe('PlotterTest.jsx ...', function(){...})``

      -  This ensures that the default test runner will find your tests
      -  You can add more to the root describe string, as long as it
         contains the file name

Writing tests
~~~~~~~~~~~~~

To explain test writing, I will review
`ExampleComponent.jsx <https://github.com/CDAT/vcdat/blob/master/frontend/test/mocha/example/ExampleComponent.jsx>`__
and
`ExampleTest.jsx <https://github.com/CDAT/vcdat/tree/master/frontend/test/mocha/example/ExampleTest.jsx>`__,
which I wrote to make sure that our environment was set up correctly to
test React components. If you get lost while reading this guide, try
following along with the code and comments in
`ExampleTest <https://github.com/CDAT/vcdat/tree/master/frontend/test/mocha/example/ExampleTest.jsx>`__.

The
`Example <https://github.com/CDAT/vcdat/blob/master/frontend/test/mocha/example/ExampleComponent.jsx>`__
component is extremely simple. When an ``<ExampleComponent />`` component is
rendered into the DOM, it gets replaced with
``<div class='test'><span>TEST</span></div>``.

To test a react component, we have to import several libraries and other
Javascript files:

-  `Enzyme <#enzyme>`__ provides shallow and mounted rendering as well as a variety of useful tools to interact with out components.
-  `chai <#chai>`__ lets us use functions like 'assert' and 'expect' to
   test our rendered html
-  Obviously, React needs to be loaded to run React code
-  Finally, we have to import the component we are testing

After we have all the correct libraries and files imported, there are
two essential things we need to make a test.

-  a `describe() <#describe>`__ block, which lets us group our tests
-  and an `it() <#it>`__ block, which contains the test

After that, all that's left to do is use `Enzyme <#enzyme>`__ to
shallow render the React component in the DOM, manipulate it, and test it with an assert. 
When we run ``npm test``, mocha will let us know if it gets any errors while running our test.

Testing Tips
~~~~~~~~~~~~~

Parameterizing Tests
^^^^^^^^^^^^^^^^^^^^^

Parameterizing tests is one of the easiest ways to write tests that cover a large range of cases. 
The CalculatorTest.jsx file contains several examples of this for reference. 
Here is a simple example of what a parameterized test might look like:

.. code:: javascript

    let test_cases = [
        { input: undefined, right: undefined, expected: "Hello!" },
        { input: "John", right: undefined, expected: "Hello John!" },
        { input: "Sally?", right: undefined, expected: "Hello Sally!" },
    ];

.. code:: javascript

    test_cases.forEach(function(test_case, index) {
        it(`Says hello correctly. Case ${index}`, function() {
            let props = getProps();
            let hello_widget = shallow(<Hello {...props} />);
            hello_widget.instance().handleHello(input_string: test_case.input)
            expect(hello_widget.state().helloString).to.equal(test_case.expected);
        });
    });

Notice that the 'it' block is inside of the loop.
This makes each loop a seperate test and will make it easier to determine which cases fail.

Debugging Tests
~~~~~~~~~~~~~~~~

To run a debugger on your tests, follow these steps:

1. Add 'debugger' on a line by itself where you would like execution to
   pause.
2. Run: ``npm run debug_tests``
3. Visit: chrome://inspect/#devices and look under "Remote Target" for
   the instance of mocha to inspect.
4. Click Chrome's "Resume Execution" button to allow mocha to execute
   tests until your own breakpoints.

Testing Tools
~~~~~~~~~~~~~

Enzyme
^^^^^^^

Enzyme is a javascript testing tool that provides a variety of tools that makes testing React components easier.

The full documentation can be found on Airbnb's 
`API
Reference <http://airbnb.io/enzyme/>`__ page

The following are some of the most common/useful methods that enzyme provides:

- shallow: Shallow renders a component so that tests are not affected by child components.
- mount: Mounts a component in a full DOM environment (jsdom), and provides full component lifecycle support.
- instance(): Returns the component instance that enzyme normally wraps. Good for calling component methods directly. 
- state(): Returns the component's state object.
- setState(): Sets the component state in the same manner that React's setState does.
- props(): Returns a components current props.
- setProps(): Emulates prop changes.
- find(): Search for dom elements that the component has rendered.


Mocha
^^^^^

describe
''''''''

Mocha's ``describe()`` function allows us to group tests into their own
suites. This makes it easy to separate concerns, and provides a simple
way of running specific tests via Mocha's CLI. ``describe()`` blocks can
be arbitrarily nested, allowing for separation of suites into
sub-suites.

.. code:: javascript

   describe('My_test_suite', function(){
       // ... testing goes here
       describe('A subset of My_test_suite', function(){
           // ... more specific tests here
       });
   });

it
''

``it()`` blocks contain individual tests in your test suite. They are
provided with a string for description, and a function which runs the
test. Generally, the description string should say something about what
the result of the test should be.

.. code:: javascript

   describe('suite', function(){
       it('should fail', function(){
           assert(false);
       })
   })

Hooks
'''''

`Hooks <https://mochajs.org/#hooks>`__ are functions that let you run a
block of code before or after a function, or a number of functions, in
your test suites. These hooks include ``before()``, ``beforeEach()``,
``after()``, and ``afterEach()``. These hooks can be invoked with a
description, or with named functions, to help with pinpointing errors.
They can also be invoked asynchronously.

.. code:: javascript

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

For more information, refer to `Mocha's
documentation <https://mochajs.org/#hooks>`__

Chai
^^^^

assert
''''''

Chai expands on Node's assert library. See the `full
API <http://chaijs.com/api/assert/>`__ for more information.

Example from `Chai's
documentation <http://chaijs.com/guide/styles/#assert>`__:

.. code:: javascript

   var assert = require('chai').assert
   var foo = 'bar'
   var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

   assert.typeOf(foo, 'string'); // without optional message
   assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
   assert.equal(foo, 'bar', 'foo equal `bar`');
   assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
   assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');

expect
''''''

``expect()`` is one of Chai's `BDD-style assert
APIs <http://chaijs.com/api/bdd/>`__.

Example from `Chai's
documentation <http://chaijs.com/guide/styles/#expect>`__:

.. code:: javascript

   var expect = require('chai').expect
   var foo = 'bar'
   var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

   expect(foo).to.be.a('string');
   expect(foo).to.equal('bar');
   expect(foo).to.have.length(3);
   expect(beverages).to.have.property('tea').with.length(3);

should
''''''

``should()`` is the other of Chai's `BDD-style assert
APIs <http://chaijs.com/api/bdd/>`__.

Example from `Chai's
documentation <http://chaijs.com/guide/styles/#should>`__:

.. code:: javascript

   var should = require('chai').should() //actually call the function
   var foo = 'bar'
   var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

   foo.should.be.a('string');
   foo.should.equal('bar');
   foo.should.have.length(3);
   beverages.should.have.property('tea').with.length(3);