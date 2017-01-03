import BaseModel from './BaseModel.js';


class TemplateModel extends BaseModel {
    static reduce(state={}, action) {
        switch (action.type) {
            case 'INITIALIZE_TEMPLATE_VALUES':
                return action.templates;
            default:
                return state
        }
    }

    static getInitialState() {
        return $.get("getTemplates");
    }
}

export default TemplateModel
