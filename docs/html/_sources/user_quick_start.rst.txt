.. _quick-start:

=================================
Quick Start
=================================

This guide will walk you through running the vcdat application as well as some steps to create and manipulate a simple plot.

Run vCDAT
=================================

Activate your conda environment. For example: ``source activate vcdat``
If you have a newer version of conda the command may instead be: ``conda activate vcdat``

Next, run the vCDAT server: ``vcdat``

  * Add the ``--print`` argument if you would like the log displayed instead of written to a file
  * Add the ``--no-browser`` option if you do not want vcdat to spawn a browser for you

If you added the no-browser option, you will need to navigate to the app yourself. E.g. ``localhost:5000``

You should now see the vCDAT interface in a new browser window. If not, consult our :ref:`user-troubleshooting` section for help.

.. Note:: | If you need some sample data to plot, once you activate your conda environment, run: ``vcs_download_sample_data`` in the terminal to download some basic datasets. (If vCDAT has opened up a browser window, open a second terminal session to run the command to download the sample data so you don't have to kill the vcdat session (via Ctrl C) to get a prompt in the terminal window.)
  | The sample datasets will be found in your vcdat environment. If you installed a Python 2 version of Anaconda the path to one of the sample data files will be: ``anaconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc``
  | The clt.nc file is a NetCDF file containing monthly Total Cloudiness values for ten years: from January 1979 through December 1988.

Quick Help
=================================

In the top left corner there is a 'Help' button which will give a quick tour of vCDAT features.

More help buttons can be found on specific dialog pages. Click on a 'help' button to initiate a tutorial.


Load a Variable
=================================

In the left side bar there is a section for handling variables. Click on the green plus button to open the *Load Variable* menu.

On the right hand side of the menu is a blue button with a file icon. Click this to bring up the file explorer.

Click on the file you would like to load and then click the *Select* button.

vCDAT will now populate the load variable menu with the data from the selected file. Use the *Variable(s)* select box to pick out which variable you would like to visualize.

Click on *Load and Close*


Simple Plot
=================================

By default, vCDAT shows a single cell. Each cell will display the variables, graphics methods and templates that have been set. To the right of this information is a large plus icon that we can use to add multiple plots to a single cell.

To plot with the vcs defaults, drag and drop the variable name from the left side bar over the *Variables* section of a cell. 

vCDAT will automatically plot the given data with the default boxfill method.


Change Plot Parameters
=================================

In order to get a more smooth looking graph we can use an isofill method.

Click on the rendered plot. This will select the cell, turning the border blue and displaying the plot information in the top bar.

From here we can change the the Graphics Type from *boxfill* to *isofill*

The plot will render again using the new method which will smooth out the data for us.

Stack Plots
================================

Now, we can stack another plot on top of this one to highlight areas of interest. 

In the tools menu, click on *Add Plot*

This will add an empty plot for us as noted by the extra row displayed in the top bar. vCDAT will render the plots in order, from the top of this list to the bottom.

In this case, we want the isofill to plot first, and the isoline to plot after.

Under Graphics Type for the second plot, select the "isoline" option.

Now select the same variable as the first plot. 

The isoline plot will now render on top of the isofill.

