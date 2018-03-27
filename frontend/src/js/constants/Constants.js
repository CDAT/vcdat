const ONE_VAR_PLOTS = ["boxfill", "isofill", "isoline"] // meshfill can be either 1 or 2
const TWO_VAR_PLOTS = ["vector", "3d_vector", "streamline"]

const JOYRIDE_STEPS = [
    {
        title: 'Welcome to vCDAT!',
        text: 'The following tour will help guide you through the basic features of vCDAT. '.concat(
            'Click "Next" to continue the tour.'
        ),
        selector: '.joyride',
        position: 'top',
        type: 'click',
        style: {
            arrow: {
                display: 'none'
            },
            skip: {
                color: '#f04'
            },
        }   
    },
    {
        title: 'Plot Parts',
        text: 'There are three parts to any given plot. Variables, a Graphics Method, and a Template.'.concat(
            ' Each of these can be dragged and dropped into a cell.'
        ),
        selector: '#left-side-bar',
        position: 'right',
        type: 'click',
        style: {
            hole: {
                marginTop: "-1px"
            }
        }
    },
    {
        title: 'Variables',
        text: 'Use the <span style="color: rgba(40, 167, 69, 0.8);">Add</span> <span style="color: rgba(217, 120, 36, 0.8);">Edit</span> and '.concat(
            '<span style="color: rgba(196, 28, 31, 0.8);">Delete</span> buttons to modify what variables are loaded. ',
            'In order to edit or delete a variable, ',
            'click on it to select it first. Graphics Methods and Templates can be edited in the same manner.'
        ), 
        selector: '.var-list-container',
        position: 'right',
        type: 'click',
    },
    {
        title: 'Graphics Methods',
        text: 'Graphics Methods define what the plot itself should look like. Select one to edit things like the colormap, projection, and more.',
        selector: '.gm-list-container',
        position: 'right',
        type: 'click',
    },
    {
        title: 'Templates',
        text: 'Templates define how the plot is presented. '.concat(
            'They control everything about the labels and axes as well as the size and location of the plots inside a cell.'
        ),
        selector: '.template-list-container',
        position: 'right',
        type: 'click',
    },
    {
        title: 'Spreadsheet',
        text: 'The spreadsheet is made up of Cells. Each cell provides areas to drop variables, '.concat(
            'graphics methods and templates, as well as an area to drop these items to create a new plot within the cell. ',
            'Clicking on a cell will select and highlight the cell.'
        ),
        selector: '.spreadsheet-div',
        position: 'top',
        type: 'click',
    },
    {
        title: 'Spreadsheet Toolbar',
        text: 'The spreadsheet toolbar controls how many rows and columns of cells should be in a given sheet. It also allows for creating and switching between sheets.',
        selector: '.spreadsheet-toolbar',
        position: 'right',
        type: 'click',
        style: {
            hole: {
                marginTop: "-1px"
            }
        }
    },
    {
        title: 'Inspecting Plots',
        text: 'When a cell is selected, each plot inside the cell is listed here. '.concat(
            'Use this window to inspect and change things such as the variables or templates that define the plot, ',
            'as well as remove plots when there is more than one in a cell.'
        ),
        selector: '.plot-inspector-container',
        position: 'right',
        type: 'click',
    },
    {
        title: 'Tools',
        text: 'The tools section contains various tools and actions that you may find useful. '.concat(
            '</br><span style="color: green;">Add Plot</span> will add an additional plot to a cell. ',
            'Use this as an overlay or as an in-cell side-by-side comparison.',
            '</br><span style="color: red;">Clear Cell</span> will reset the cell back to the default. ',
            'This can be undone if you accidentally click it with the undo button.',
            '</br><span style="color: blue;">Colormap Editor</span> will open a window for creating, editing, and applying colormaps.'
        ),
        selector: '.tools-container',
        position: 'right',
        type: 'click',
    },
]
export { JOYRIDE_STEPS }
export { ONE_VAR_PLOTS }
export { TWO_VAR_PLOTS }
