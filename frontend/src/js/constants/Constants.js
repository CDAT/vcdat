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
            '</br><span style="color: purple;">Export</span> allows you to export/save the plot. NOT Implemented.',
            '</br><span style="color: orange;">Calculator</span> allows you to create a new variable based on',
            ' calculations performed on another variable.'
        ),
        selector: ".tools-container",
        position: "right",
        type: "click"
    },
    {
        title: "Calculator",
        text: "This button opens the calculator tool! Cool right?! Yeah it's cool :p",
        selector: "#open-calculator-button",
        position: "right",
        type: "hover"
    }
];

const CALCULATOR_STEPS = [
    {
        title: 'Calculator Tour',
        text: 'This is a tour of the calculator and how to use it!',
        selector: '#calculator-main',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Variables List',
        text: "All the available variables that you've loaded are listed here.",
        selector: '#calc-variable-region',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Derived Variable',
        text: "Enter the name of the new variable you wish to derive here.",
        selector: '#new-variable-name',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Calculation Area',
        text: 'The calculation to be performed will be expressed here.'.concat(
            '<br />To enter a variable, drag it outside of this area and within the green rectangle that appears.'),
        selector: '#calculation',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Calculator Operations',
        text: "The calculator supports TWO operands (constants or variables) and ONE operator, when deriving a new variable.".concat(
            "However you can use previously derived variables to perform further calculations."),
        selector: '#calc-button-region',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Regrid Operations',
        text: "Clicking the 'Regrid' button once you have entered a variable will perform a regrid operation.".concat(
            "<br />The drop-down on the 'Regrid' button lets you specify what kind of regrid operation to perform.",
            '<br /><span style="color: blue;">Linear</span> is the default regrid operation.'
        ),
        selector: '#regrid',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Complete Calculation',
        text: "When you are done setting the calculation click 'Enter' to perform the calculation and have it saved as a new derived variable.",
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
        title: 'Calculation Area',
        text: 'The calculation to be performed will be expressed here.'.concat(
            'To enter a variable, drag it outside of this area and within the green rectangle that appears.'),
        selector: '#colormap-cells-container',
        position: 'right',
        type: 'click'
    },
    {
        title: 'Derived Variable',
        text: "Enter the name of the new variable you wish to derive here.",
        selector: '#color-pickers',
        position: 'left',
        type: 'click'
    },
    {
        title: 'Calculator Operations',
        text: "The calculator supports TWO operands (constants or variables) and ONE operator when deriving a new variable.".concat(
            "<br />However you can use previously derived variables to perform further calculations."),
        selector: '#calc-button-region',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Regrid Operations',
        text: "Clicking the 'Regrid' button once you have entered a variable will perform a regrid operation.".concat(
            "<br />The drop-down on the 'Regrid' button lets you specify what kind of regrid operation to perform.",
            '<br /><span style="color: blue;">Linear</span> is the default regrid operation.'
        ),
        selector: '#regrid',
        position: 'bottom-right',
        type: 'hover'
    },
    {
        title: 'Complete Calculation',
        text: "When you are done setting the calculation click 'Enter' to perform the calculation and have it saved as a new derived variable.",
        selector: '#enter',
        position: 'bottom-right',
        type: 'hover'
    }
];

export { JOYRIDE_STEPS };
export { CALCULATOR_STEPS };
export { COLORMAP_STEPS };
export { ONE_VAR_PLOTS };
export { TWO_VAR_PLOTS };
export { BINARY_OPERATORS };
export { UNARY_OPERATORS };
