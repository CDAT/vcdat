import BaseModel from './BaseModel.js';
import { toast } from 'react-toastify'

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
        try{
            return vcs.getalltemplatenames()
        }
        catch(e){
            if(e instanceof TypeError && e.message === "vcs.getalltemplatenames is not a function"){
                const message = "Unable to retrieve templates. You may need to update vcs-js. Run: conda install -c cdat vcs-js"
                toast.error(message, { position: toast.POSITION.BOTTOM_CENTER, autoClose: 8000 })
            }
            else{
                console.warn(e)
            }
            return []
        }
        
    }
}

export default TemplateModel
