.. _dev-coding-guidelines:

=================================
Releases
=================================

Releases can be viewed on anaconda.org_. 

.. _anaconda.org: https://anaconda.org/cdat/vcdat/files




vCDAT Manual Releases
-----------------------------

In the event that the continuous integration service fails to make a nightly release, the following can be done to create a build an release it manually.

- Before you can release vCDAT you must be listed as a co-owner of the cdat organization
- cd into the vcdat directory and make sure that you are using the base conda environment. (Run ``source deactivate`` to go from *nightly* to *base* for instance)

Once that is done, begin running each command below:

.. code-block:: bash

    mkdir ~/conda-bld # Creates a directory for our build to go
    conda install -q anaconda-client conda-build # Needed in order to build and upload our package
    conda config --set anaconda_upload no # Prevents auto upload since we want to do that ourselves
    conda install -f six # Not sure this is needed. It was in the old script, and it doesn't hurt to have it
    git clone git://github.com/cdat/conda-recipes # Contains the prep_for_build script that we use
    cd conda-recipes
    ln -s ../conda vcdat # Creates a symbolic link to our conda directory so that prep_for_build can find it
    python ./prep_for_build.py -v $NEW_VERSION # Creates our meta.yaml with the given semantic version number (0.0.0)
    conda build -c cdat -c conda-forge vcdat # Build the production version of the package
    anaconda -t $CONDA_UPLOAD_TOKEN upload -u cdat $BUILT_PACKAGE --force
    # $CONDA_UPLOAD_TOKEN: can be retrieved from https://anaconda.org/cdat/settings/access
    # $BUILT_PACKAGE: The full path to the newly built .tar.bz2 package. Use the path output by conda build


Finally, make sure to test the release:
::

    conda create -n vcdat-version vcdat -c cdat -c conda-forge 
    source activate vcdat-version
    vcdat --print

.. _vcs-widgets-release:

VCS-Widgets Release:
-----------------------------
::

    cd ~/Projects/CDAT/vcs-widgets
    git pull origin master
    source activate vcdat

edit ``package.json`` with new ``version`` number
::

    npm build
    npm publish

https://anaconda.org/cdat

https://www.npmjs.com/package/vcs-widgets