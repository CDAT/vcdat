# vCDAT Docs

The vCDAT docs are build with sphinx which converts the source .rst files into html. The files are then placed in the docs/html folder. To build the docs, simply make sure that sphinx is installed: `conda install sphinx`, as well as the theme that we use: `pip install sphinx_rtd_theme`. Then, run `make html` from the root directory.

To make development easier you may consider installing sphinx-autobuild: `pip install sphinx-autobuild`

Run the autorebuild software with: `sphinx-autobuild source docs/html`

This will watch the source files and rebuild as well as run a webserver that will autoreload on change. 

Make sure that the files have been saved and built before uploading them to github for hosting. 


#### Troubleshooting

* If the table of contents on the left side has issues where links disappear when switching pages, try deleting the contents of the docs/html/ folder. Sometimes this fixes the issue. 


