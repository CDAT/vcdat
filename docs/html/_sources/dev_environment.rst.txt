.. _dev-env:

=================================
Development Environment
=================================

The following guide assumes that you are using Microsoft's VSCode editor.

Recommended Plugins
--------------------

- `ES-Lint <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>`__
- `Prettier <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>`__
- `Python <https://marketplace.visualstudio.com/items?itemName=ms-python.python>`__


Recommended Settings
--------------------

Inside the .vscode/ folder we recommend adding the following settings:

.. code:: json

  {
    "python.linting.enabled": true,
    "editor.formatOnSave": true, // This tells Prettier to auto-format .js and .jsx files on save
  }

It is highly recommended to open the VSCode Command Palette (Mac: Shift + CMD + P) 
and use the ``Python: Select Interpreter`` command to select the python from your conda environment.

