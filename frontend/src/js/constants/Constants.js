const ONE_VAR_PLOTS = ["boxfill", "isofill", "isoline"] // meshfill can be either 1 or 2
const TWO_VAR_PLOTS = ["vector", "3d_vector", "streamline"]

const JOYRIDE_STEPS = [
    {
        title: 'Welcome to vCDAT!',
        text: 'The following tour will help guide you through the basic features of vCDAT. Click "Next" to continue the tour.',
        selector: '#app',
        position: 'top',
        type: 'click',
        isFixed: true,
        style: {
            arrow: {
                display: 'none'
            },
        }   
    },
    {
        title: 'Plot Parts',
        text: 'There are three parts to any given plot. Variables, a Graphics Method, and a Template. Each of which can be dragged and dropped into a cell.',
        selector: '#left-side-bar',
        position: 'right',
        type: 'click',
    },
    {
        title: 'Variables',
        text: 'Use the \'Add\' \'Edit\' and \'Delete\' buttons to modify what variables are loaded. In order to edit or delete a variable, click on it to select it first.',
        selector: '.var-container .navbar-right.side-nav',
        position: 'right',
        type: 'click',   
    }
]
export { JOYRIDE_STEPS }
export { ONE_VAR_PLOTS }
export { TWO_VAR_PLOTS }
