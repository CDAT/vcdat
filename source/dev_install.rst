.. _dev-install:

=================================
Installation
=================================

Basics
-----------------------------

::

  apt update
  apt upgrade
  apt install git openssl gcc libglu1-mesa mesa-utils libsm6 x11-apps
    
* `Set up Github ssh key`_
* `Download and install anaconda`_
* `Fork vcdat repo`_

.. _Set up Github ssh key: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
.. _Download and install anaconda: https://www.continuum.io/downloads
.. _Fork vcdat repo: https://github.com/CDAT/vcdat

::

  cd Downloads/
  conda config --set ssl_verify false
  cd ~/Path/To/Projects
  git clone git@github.com:USERNAME/vcdat.git
  cd vcdat
  ./scripts/setup.sh

Before Running vCDAT
-----------------------------

* Turn on/off uvcdat tracking::

    export UVCDAT_ANONYMOUS_LOG=no

* Download data::

    vcs_download_sample_data

Running vCDAT
-----------------------------

* Start the development server::

    source activate nightly
    ./scripts/autorun.sh

* open browser to ``localhost:5000``  
* click the round ``+`` next to Variables in the upper left
* click add
* navigate to ``anaconda2/envs/nightly/share/uvcdat/sample/data/clt.nc``
* click ``clt.nc``
* click ``clt``
* drag ``clt`` on to the canvas

.. image:: https://user-images.githubusercontent.com/438922/28264342-61465538-6a9f-11e7-9795-e798857a8ee3.png

Updating vCDAT npm Packages
-----------------------------

    cd vcdat
    git pull
    ./scripts/setup.sh
    cd frontend
    npm install


.. _dev-local-vcs-widgets:

Local vcs-widgets
-----------------------------

When running the autorun script you may see the following line displayed:

``vcs-widgets is not symlinked, so will not be automatically watched.``

This is generally fine, but is not what we want if we are developing on that package. 
To get a local version into vcdat we just need to tell npm to link it.

1. Create a folder to store global npm modules. For this example we will use ``~/npm-global``
2. Tell npm to use the global folder, otherwise it may get confused. ``npm config set prefix ~/npm-global/`` 
3. Navigate into the vcs-widgets directory: ``cd VCS-widgets``
4. Register that the package can be linked to: ``npm link``
5. Navigate back to the vcdat frontend directory: ``cd ../vcdat/frontend``
6. Run ``npm link vcs-widgets``

Now when you execute the autorun script the symlink message should be gone, and the widgets should reflect the local version that was linked. 

Important Links
-----------------------------

* https://anaconda.org/cdat
* https://www.npmjs.com/package/vcs-widgets  