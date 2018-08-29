const ONE_VAR_PLOTS = ["boxfill", "isofill", "isoline"]; // meshfill can be either 1 or 2
const TWO_VAR_PLOTS = ["vector", "3d_vector", "streamline"];
const UNARY_OPERATORS = ["-", "~", "not"];
const BINARY_OPERATORS = ["+", "-", "^", "/", ">>", "<<", "%", "*", "**", "|", "&", ">", "<", ">=", "<=", "!=", "==", "regrid"];

const JOYRIDE_STEPS = [
    {
        title: "Welcome to vCDAT!",
        text: "The following tour will help guide you through the basic features of vCDAT. ".concat(
            'Click "Next" to continue the tour. ',
            '<div class="contact-us-link">Found a bug or need help? ',
            '<a href="https://github.com/CDAT/vcdat/wiki/Contact-Us" target="_blank">Contact Us</a></div>'
        ),
        selector: ".joyride",
        position: "top",
        type: "click",
        style: {
            arrow: {
                display: "none"
            },
            skip: {
                color: "#f04"
            }
        }
    },
    {
        title: "Plot Parts",
        text: "There are three parts to any given plot. Variables, a Graphics Method, and a Template.".concat(
            " Each of these can be dragged and dropped into a cell."
        ),
        selector: "#left-side-bar",
        position: "right",
        type: "click",
        style: {
            hole: {
                marginTop: "-1px"
            }
        }
    },
    {
        title: "Variables",
        text: 'Use the <span style="color: rgba(40, 167, 69, 0.8);">Add</span> <span style="color: rgba(217, 120, 36, 0.8);">Edit</span> and '.concat(
            '<span style="color: rgba(196, 28, 31, 0.8);">Delete</span> buttons to modify what variables are loaded. ',
            "In order to edit or delete a variable, ",
            'click on it to <span style="color: white; background-color: #df691a;">Select</span> it first. ',
            "Graphics Methods and Templates can be edited in the same manner."
        ),
        selector: ".var-list-container",
        position: "right",
        type: "click"
    },
    {
        title: "Graphics Methods",
        text: "Graphics Methods define what the plot itself should look like. ".concat(
            '<span style="color: white; background-color: #df691a;">Select</span> one to edit the colormap, projection, and more.'
        ),
        selector: ".gm-list-container",
        position: "right",
        type: "click"
    },
    {
        title: "Templates",
        text: "Templates define how the plot is presented. ".concat(
            "They control everything about the labels and axes as well as the size and location of the plots inside a cell."
        ),
        selector: ".template-list-container",
        position: "right",
        type: "click"
    },
    {
        title: "Spreadsheet",
        text: "The spreadsheet is made up of Cells. Each cell provides areas to drop variables, ".concat(
            "graphics methods and templates, as well as an area to drop these items to create a new plot within the cell. ",
            "Clicking on a cell will select it."
        ),
        selector: ".spreadsheet-div",
        position: "top",
        type: "click"
    },
    {
        title: "Spreadsheet Toolbar",
        text:
            "The spreadsheet toolbar controls how many rows and columns of cells should be in a given sheet.".concat(
            " It also allows for creating and switching between sheets."),
        selector: ".spreadsheet-toolbar",
        position: "right",
        type: "click",
        style: {
            hole: {
                marginTop: "-1px"
            }
        }
    },
    {
        title: "Inspecting Plots",
        text: "When a cell is selected, each plot inside the cell is listed here. ".concat(
            "Use this window to inspect and change things such as the variables or templates that define the plot, ",
            "as well as remove plots when there is more than one in a cell."
        ),
        selector: ".plot-inspector-container",
        position: "right",
        type: "click"
    },
    {
        title: "Tools",
        text: "The tools section contains various tools and actions that you may find useful. ".concat(
            '</br><span style="color: green;">Add Plot</span> will add an additional plot to a cell. ',
            "Use this as an overlay or as an in-cell side-by-side comparison.",
            '</br><span style="color: red;">Clear Cell</span> will reset the cell back to the default. ',
            "This can be undone if you accidentally click it with the undo button.",
            '</br><span style="color: blue;">Colormap Editor</span> will open a window for creating, editing, and applying colormaps.',
            '</br><span style="color: purple;">Export</span> allows you to export/save the plot.',
            '</br><span style="color: orange;">Calculator</span> allows you to derive new variables using',
            ' available variables and mathematical operations.'
        ),
        selector: ".tools-container",
        position: "right",
        type: "click"
    }
];

const CALCULATOR_STEPS = [
    {
        title: 'Calculator Tour',
        text: "This is the calculator. It Helps you create new variables. Let's take a look!",
        selector: '#calculator-main',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Calculator Operations',
        text: "At the moment the calculator can only perform one operation at the time, either based on ".concat(
            "<span style='color: orange;'>TWO operands</span> (variables or constants) or a ",
            "<span style='color: green;'>SINGLE variable OPERATOR.</span>"
        ),
        selector: '#calc-button-region',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Variables List',
        text: "All the available variables that you have loaded are listed here.",
        selector: '#calc-variable-region',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Derived Variable',
        text: "The final name for the derived variable appears here. VDAT automatically constructs one for you, ".concat(
            "based on your operations, but you can decide on another name by typing it here."),
        selector: '#new-variable-name',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Calculation Area',
        text: 'The calculation to be performed will be expressed here.'.concat(
            '<br />To use a variable, drag it in the green rectangle.'),
        selector: '#calculation',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Regrid Operations',
        text: "The 'Regrid' drop-down, let's you decide which regridder tool and method you would like to use".concat(
            '<br /><span style="color: blue;">Linear</span> is the default regrid operation.'
        ),
        selector: '#regrid',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Compute New Variable',
        text: "When you are done setting the calculation click the 'Enter' button or simply press 'Enter' ".concat(
            "to perform the calculation and have it saved as a new derived variable.",
            "You can use it right away to derive yet another variable."
        ),
        selector: '#enter',
        position: 'bottom-right',
        type: 'hover'
    }
];

const COLORMAP_STEPS = [
    {
        title: 'Colormap Editor Tour',
        text: 'This is a tour of the Colormap Editor and how to use it!',
        selector: '#colormap-editor-main',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Colormap List',
        text: "This dropdown lets you choose from various colormaps.",
        selector: '#colormap-dropdown',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Create New Colormap',
        text: "Click this button to create a new copy of the current color-map which you can then modify and save as you like.",
        selector: '#btn-new-colormap',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Color Grid',
        text: 'All the colors of the color map are listed here in order. Clicking on a cell will allow you to change its color'.concat(
            '<br />You can also select a range of cells by first clicking one cell and then holding shift and clicking on another.'
        ),
        selector: '#colormap-cells-container',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Color Picker',
        text: "Once you have selected a cell, you can change the colors of the cell to your choice of predefined or custom colors.".concat(
            '<br />Note: If you select multiple cells, only the color of the last cell in the range will actually be changed.'
        ),
        selector: '#color-pickers',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];

const LOAD_VARIABLE_STEPS = [
    {
        title: 'Colormap List',
        text: "This dropdown lets you choose from various colormaps.",
        selector: '#colormap-dropdown',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Create New Colormap',
        text: "Click this button to create a new copy of the current color-map which you can then modify and save as you like.",
        selector: '#btn-new-colormap',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Color Grid',
        text: 'All the colors of the color map are listed here in order. Clicking on a cell will allow you to change its color'.concat(
            '<br />You can also select a range of cells by first clicking one cell and then holding shift and clicking on another.'
        ),
        selector: '#colormap-cells-container',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Color Picker',
        text: "Once you have selected a cell, you can change the colors of the cell to your choice of predefined or custom colors.".concat(
            '<br />Note: If you select multiple cells, only the color of the last cell in the range will actually be changed.'
        ),
        selector: '#color-pickers',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];

const TEMPLATE_EDITOR_STEPS = [
    {
        title: 'Template Editor Tour',
        text: 'This will explain some of the main components of the template editor.',
        selector: '#template-editor-main',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Template Preview',
        text: "This shows a preview of the template as changes are made.",
        selector: '#test-12345',
        position: 'bottom',
        type: 'click'
    },
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];

const BOXFILL_EDITOR_STEPS = [
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];

const ISOFILL_EDITOR_STEPS = [
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];

const ISOLINE_EDITOR_STEPS = [
    {
        title: 'Blend Colors',
        text: "Clicking this button while having a cell range selected will interpolate the colors between the first cell".concat(
            ' and the last cell of the selected range.<br />It is a fast way to create your own custom color map!'
        ),
        selector: '#btn-blend',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Save Colormap',
        text: "Clicking this button will save your changes on the current colormap.<br />Note: ",
        selector: '#btn-save-colormap',
        position: 'top',
        type: 'click'
    },
    {
        title: 'Import and Export',
        text: "Click this button if you wish to export your colormap as a JSON file for download, or to import a colormap JSON file.",
        selector: '#btn-import-export',
        position: 'top',
        type: 'click'
    },
];



export { JOYRIDE_STEPS };
export { CALCULATOR_STEPS };
export { COLORMAP_STEPS };
export { LOAD_VARIABLE_STEPS };
export { TEMPLATE_EDITOR_STEPS };
export { BOXFILL_EDITOR_STEPS };
export { ISOFILL_EDITOR_STEPS };
export { ISOLINE_EDITOR_STEPS };
export { ONE_VAR_PLOTS };
export { TWO_VAR_PLOTS };
export { BINARY_OPERATORS };
export { UNARY_OPERATORS };