import BaseModel from './BaseModel.js';


class TemplateModel extends BaseModel {
    static reduce(state={}, action) {
        switch (action.type) {
            case 'INITIALIZE_TEMPLATE_VALUES':
                return action.templates;
            case 'UPDATE_TEMPLATE':
                const new_templates = $.extend(true, {}, state);
                new_templates[action.template.name] = action.template;
                return new_templates;
            default:
                return state;
        }
    }

    static getInitialState() {
        return $.get("getTemplates");
    }
}

export default TemplateModel
