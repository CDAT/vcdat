====================
Manual Testing Guide
====================

Test Help Tutorials
^^^^^^^^^^^^^^^^^^^

* Manually test the first help tutorial by clicking the ‘Help’ button at top-left of the page.
* Similarly click on the calculator and colormap buttons, then click their respective ‘Help’ buttons to test their tutorials.

**You should see a step-by-step tutorial that explains vCDAT features.**

------------

Set-up ‘CLT’ variable for testing
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Load vCDAT web page.
* Click the green plus icon next to ‘Variables’ of the left side-bar to open a file.
* Select the ‘clt.nc’ file from your sample_data directory.
* The first variable selected should be labeled ‘clt’, so click ‘Load’, load dialog should remain open so you can load another variable.
* Now choose a variable from the drop-down (like ‘u’ or ‘v’) and click ‘Load and Close’. The form should close after loading the variable.
* From variables list, drag the ‘clt’ variable in the variables list onto the main plot region (has a huge green plus button).

**The plot should be created automatically.**

------------

Test Plotting Features
^^^^^^^^^^^^^^^^^^^^^^
* With ‘clt’ variable selected, click the orange ‘edit’ icon (next to green plus icon). This should open a dialog that lets you select a specific range for time, latitude and longitude data. Select a subset of the data (lat/lon/time) by moving the dimension sliders. Click save.
* Check that plot shape has changed and correctly displays the data subset.
* Clicking to edit the ‘clt’ variable again, you can also rearrange the axes of the plot by clicking and dragging the icons next to the longitude, time or latitude labels. 

**Based on the order, the plot should change to reflect the new axes positions.**

------------

Test Calculator Features
^^^^^^^^^^^^^^^^^^^^^^^^
* Click the ‘Calculator’ button on the top-left corner of the window. This should bring up a calculator modal with the ‘clt’ variable listed on the left.
* Click and drag the ‘clt’ variable onto the green highlighted area that appears (avoid the grayed out area). Click an operator button (+,-,/,x,x^y,regrid), enter a value, then click ‘enter’. This should produce a derived variable with a default name in the variable list. Close the calculator.
* Plot the newly derived variable and check that the results look correct. 

**Repeat with different operators and values to test the calculator.**

------------

Test Colormap Features
^^^^^^^^^^^^^^^^^^^^^^
* Select the ‘clt’ variable and plot it again (make sure axes are in their default order).
* Plot again and then click ‘Colormap Editor’ button on top-left corner of screen.
* Load a different colormap using the ‘Colormaps’ drop-down, then click apply to see the colors updated on the plot.
* Click the ‘New’ button next to the colormap drop-down and name the colormap something (e.g. ‘test’). Then use available features to modify the colormap.

**test your new colormap by clicking ‘apply’ and looking at the plot.**

------------

Test Graphics Methods and Templates
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
* Select a template from the template list on the left (like ASD) and drag to plot area. You should see the plot change its layout. Test different (compatible) templates to make sure they’re working.
* Try creating a custom template by clicking the green plus icon, choosing a base template and entering a template name (like ‘test template’).
* With the custom template selected, click the orange edit icon above the template list and use the template editor to modify the custom template.
* Drag the custom template onto the plot area to test that the custom layout is being updated properly.

**Use the same process outlined above, test different (compatible) graphics methods as well.**

------------

Test Plotting Region Features
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
* Create a new sheet by clicking the black plus icon next to the ‘Sheet’ tab.
* On the new sheet, change row and column count to 2 using the Rows and Cols spinners located above the plotting area. This should create total of 4 plot regions (2x2). 
* On one of the plot regions, click the huge plus button (turns green when hovered over). 

**This should let you add another variable to the plot. The plots will end up sharing the same region (for overlaying plots).**

* Now drag variables you choose into each region to check that graphing over multiple regions is working correctly. You can also compare multiple plots with each other this way.
* At the top of the page, each time a variable is added, **you should see it added to a list.** 
* Using the drop-down menus, change the graphics type, method and template of different variables. 

**The changes should automatically update the plot region.**

* At the top of the page, click the x button to check that variables are being deleted off the plot correctly.
* Select one of the 4 plot regions, then click the ‘Clear Cell’ button on the top-left corner of the screen. 

**The clear cell button should remove all the variables from the selected plot region.**

* Selecting each plot region, click on the ‘Clear Cell’ button until all regions are clear.
* Once the regions are all cleared (clear button works properly), delete the sheet by clicking the small x button on the sheet tab.
