.. _user-troubleshooting:

=================================
Troubleshooting
=================================

In order to troubleshoot issues with a vCDAT, open the log file while vcdat is running and compare any errors, starting from the top, to the ones listed here.

Unable to load driver: swrast_dri.so
-----------------------------------------

  * This can be fixed by exporting a variable containing the path to the missing file: ``export LD_PRELOAD='/usr/lib/x86_64-linux-gnu/libstdc++.so.6'``

X Error of failed request:  BadValue (integer parameter out of range for operation)
------------------------------------------------------------------------------------

  * First, try the above step and set the LD_PRELOAD to a valid path.
  * If you are on a Mac and vCDAT is running on a remote machine, copy the following into a bash terminal: ``defaults write org.macosforge.xquartz.X11 enable_iglx -bool true``

    * After running that command, **restart your computer, or the change will not take effect**. 
  
  * If you continue to get these errors after trying the previous steps, you may need to install/update your graphics driver.

    * This is especially commen on Linux where a generic graphics driver may be in use, instead of a hardware specific one. 

If the above steps did not fix the issue, and you installed vCDAT on a remote server
-------------------------------------------------------------------------------------

  * Make sure that the vcdat environment is sourced prior to the next step
  * Run ``conda install -c conda-forge mesalib``

ImportError: No module named ____
-------------------------------------------------------------------------------------

  * In order to work around the missing dependencies, simply run ``pip install package`` for each package found to be missing.(It may take several install and run cycles to find and install everything.)
  * In the event that a dependency is not properly installed, please let us know by creating a new [issue](https://github.com/CDAT/vcdat/issues) with the following information:

    + The output of ``conda -V``
    + The output of ``conda list``
    + The output of the install process when you ran ``conda create``
    + The full error text from the vCDAT log file

Plots are much larger than they should be
------------------------------------------

  + This is generally caused by a missing graphics driver
  + Install or upgrade your graphics driver by following the generalized steps below.
  + First, determine the brand of graphics card your computer has. (Intel, Nvidia, AMD, etc.)
  + *Before proceeding to the next step ensure that all critical files are backed up. Installing an incorrect or corrupt driver can cause the OS to become unable to render a graphical user interface. This can often be fixed by entering the OS's recovery mode and uninstalling the faulty driver, but this can be a tedious process.*
  + Then install an up to date driver for that platform from a reliable source, such as your operating system's package manager.
  + If you cannot update your driver, or if the problem persists, try installing mesa-lib: ``conda install -c conda-forge mesalib``