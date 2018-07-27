.. _user-install:

=================================
Installation
=================================

Some testing text

- If you don't already have Anaconda, download the Anaconda software package for your system: [Linux](https://conda.io/docs/user-guide/install/linux.html) or [Mac](https://conda.io/docs/user-guide/install/macos.html)

  * If you do have it, run ``conda --version`` and make sure the version is at least 4.3.11
  * You can run ``conda install -n root "conda>4.3.13"`` to update it if the version you have is too low. 

Desktop Installation
---------------------


- From your terminal, run ``conda create -n vcdat -c cdat -c conda-forge vcdat``

  * This will make an environment named 'vcdat' and install vcdat inside of it.

- Next, run ``source activate vcdat`` to use the environment that we created.
- Lastly, run vCDAT itself. ``vcdat``

  * After a few seconds, your browser should open and load vCDAT. _If no browser opens, open the log file listed in the terminal and run through the troubleshooting steps below._  

- When you wish to stop running vCDAT, just ``ctrl+c`` the terminal window.
- If you run other python programs, remember to run ``source deactivate`` to disable the conda environment.


Server Installation
---------------------

.. Yeah the sub lists are indented with 3 spaces instead of two. Text apparently has to line up with the parent

*Please note that vCDAT is still under development. While it is is capable of running on a remote server, the installation process often requires a few extra steps depending on the environment. Please consult our* :ref:`user-troubleshooting` *and* contact *pages for additional help.*

- SSH into the remote server and run ``conda create -n vcdat -c cdat -c conda-forge vcdat``

  * This will make an environment named 'vcdat' and install vcdat inside of it.

- Run ``source activate vcdat`` to use the environment that we created.
- Run the following command to start up vcdat: ``vcdat --print --no-browser``
- vCDAT will output a variety of log information. Note down the two port numbers that it bound to. In general these will be 5000 and 8000, but they might change slightly if those ports are not available. 
- Keep that terminal window open and running. In a new window (on your local machine), type this command with the following modifications: ``ssh -Y -N -L 5000:SERVER:5000 -L 8000:SERVER:8000 SERVER``

  * Replace 'SERVER' with your remote server address/name.
  * Replace 5000 with the VCDAT_PORT that you noted down previously
  * Replace 8000 with the VCSJS_PORT that you noted down previously 
  * Then run the command, and enter your credentials. **Your terminal window will appear to freeze. This is normal.**
  * Now, all network traffic that would normally be sent to *your* port 5000 will now be sent to the *server's* port 5000. The same is also true of port 8000. The -N option tells ssh to not start up a remote terminal, which is why it seems to hang. We do this to help keep track of which terminal is making the tunnel. 

- You should now have two terminals open. One for running vcdat, and the other for setting up a way to connect to it. Keep both open while using vcdat.
- Open your browser and navigate to the address ``localhost:5000``

  * If vcdat gave a different port than 5000, use that number instead. (E.g. 5001, or 5002)
  * This should be the same number that we used to set up the ssh command.

- If vCDAT loads and no errors appear, then it should be ready to use. If vCDAT does not load, please visit the :ref:`user-troubleshooting` page for common solutions.

Updating
---------------------

Run the following command in your terminal: ``check_vcdat_update.py``
The script will let you know if an update is available, and will offer to install it for you. 

Uninstalling
---------------------

- If you are still inside the 'vcdat' environment, run ``source deactivate``

  * This will remove the ``(vcdat)`` text prepended to your terminal entries.

- ``conda remove -n vcdat --all``

  * This will remove the vcdat environment that we installed vCDAT inside of.

- ``conda clean --all``

  * This will clean up all of the files that were created during the install procedure. 

Troubleshooting
---------------------

If you are having issues with vCDAT, please check the :ref:`user-troubleshooting` page for solutions to common issues.

If your problems persist, please do not hesitate to :ref:`contact-us`