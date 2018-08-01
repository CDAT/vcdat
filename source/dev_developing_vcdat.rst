.. _dev-developing-vcdat:

=================
Developing vCDAT
=================

Flask
------

While I have been trying to move functionality from flask to vcs-js, there are still some critical functions provided by the flask server.

For example:

* When loading the vcdat page, html and static files are currently served by the flask server stored in the `backend <https://github.com/CDAT/vcdat/blob/master/backend/vcdat/app.py>`__.
* Browsers are unable to query the local filesystem in detail. We use flask to provide `file browser functions <https://github.com/CDAT/vcdat/blob/master/backend/vcdat/Files.py>`__,
* When editing a template, we display an example plot to demonstrate the changes. `This is done with flask <https://github.com/CDAT/vcdat/blob/master/backend/vcdat/Templates.py>`__.

All flask functionality can be found `here <https://github.com/CDAT/vcdat/tree/master/backend/vcdat>`__.

Redux
------

It is highly recommended that you familiarize yourself with redux via the `official documentation <https://redux.js.org/>`__,
but I have supplied some basic information here with an emphasis on how we use Redux in vCDAT. 

.. _connect:

Connect
~~~~~~~

.. note:: 

    Any time a component is wrapped by something like Redux, it can affect how a component is unit tested.
    In some instances, you will only need to provide some additional props. In other, more complex cases,
    it may be easier to export an unwrapped version for testing. Historically, these components have been
    named "PureComponents" in vCDAT. For example, if the component was named "Example", we would export the wrapped
    "Example" as the default and the unwrapped one would look like ``export { Example as PureExample }``

A component that uses Redux does not 'inherit' from Redux like you might expect. Instead, a component is
'wrapped' by the connect function. 

.. code:: javascript

    export default connect(mapStateToProps, mapDispatchToProps)(Example);

Where mapStateToProps and mapDispatchToProps are functions.

mapStateToProps
^^^^^^^^^^^^^^^^

mapStateToProps does exactly what it says. It will take state from redux and hand it to the component as props.
The function is expected to return an object containing the bits of state we want.

.. code:: javascript

    const mapStateToProps = (state) => {
        return {
            selected_template: state.present.ui.selected_template,
        }
    }

We could then access this via ``this.props.selected_template``.

mapDispatchToProps
^^^^^^^^^^^^^^^^^^^

The dispatch function is what tells Redux that the store needs to change. 
The function should return an object where each key maps to a function.

.. code:: javascript

    const mapDispatchToProps = (dispatch) => {
        return {
            deselectCell: function(){
                dispatch(Actions.deselectCell())
            },
        }
    }

We could then deselect a cell by calling ``this.props.deselectCell()``


Actions
~~~~~~~~

An action is simply an object that contains data describing how the store should change.
Actions are always given to the store by the dispatch function that comes from :ref:`connect`.
We keep all of the actions that can be dispatched in the `Actions.js <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/constants/Actions.js>`__ file.
The only thing required by any action is that it has a ``type`` key.


How it works
~~~~~~~~~~~~~

Once loaded, the redux `store <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/Store.js>`__ will initialize it's state.
It does this by calling ``getInitialState()`` on each `model <https://github.com/CDAT/vcdat/tree/master/frontend/src/js/models>`__.
Once initialized, Redux follows a very simple pattern. 

When something in the store (The top level object that holds everything redux knows about our application)
needs to be updated, a component will dispatch an 'Action'. This 'Action' essentially boils down to a javascript object with a 'type' key.
Redux then looks to hand this action to every reducer it knows about. We identify the reducers inside the `Store.js <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/Store.js>`__ file by pointing to the reduce function of each model.
Each reduce function will look at the action type to determine what, if anything, needs to be done. 

Let's look at an example. Here is what happens when a user clicks a cell to select it.

Inside the `Cell component <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/components/Cell.jsx>`__
the following code segment runs in response to the browser event.

.. code:: javascript

    selectCell(){
        let id = this.getOwnCellId()
        if(this.props.selected_cell_id == id){
            // this.props.deselectCell() // if a cell is selected, a user clicking on it should deselect it.
            // Turning this feature off since a user manipulating an interactive plot toggles the selection too much
            return
        }
        else{
            this.props.selectCell(id)
        }
    }

What is important to look at here is ``this.props.selectCell(id)``. 
This function actually comes from the way we connect this component to Redux.

Look `further down <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/components/Cell.jsx#L136>`__
and you will see that selectCell comes from the mapDispatchToProps function:

.. code:: javascript

    const mapDispatchToProps = (dispatch) => {
        return {
            selectCell: function(cell_id){
                dispatch(Actions.selectCell(cell_id))
            },
        }
    }

The action that is 'dispatched' comes from the `Actions.js <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/constants/Actions.js#L73>`__
file. This file simply gives us a single reliable place to reuse our actions, 
and helps assure that the formatting of these objects is consistent.

Here is what this action does: 

.. code:: javascript

    selectCell(cell_id) {
        return {
            type: "SELECT_CELL",
            cell_id: cell_id
        };
    },

When ``dispatch()`` is called with an action. Every reducer is given the action for processing.
In this case, only the `Spreadhseet model <https://github.com/CDAT/vcdat/blob/master/frontend/src/js/models/Spreadsheet.js>`__ will make any changes to the store.
This is because each reducer looks at the ``type`` of the action and compares that with the types that it handles

Inside the Spreadsheet model we see that it indeed handles an action of type ``SELECT_CELL``

.. code::javascript

    switch (action.type) {
        case 'SELECT_CELL':
                new_state = jQuery.extend(true, {}, state);
                new_state.selected_cell_id = action.cell_id
                return new_state 

Once that completes, our store will finish updating and any component that relied on ``selected_cell_id`` will recieve the new value.

Vcs-js
-------