import BaseModel from './BaseModel.js';
import { toast } from 'react-toastify'

class TemplateModel extends BaseModel {
    static reduce(state={}, action) {
        let new_state;
        switch (action.type) {
            case 'INITIALIZE_TEMPLATE_VALUES':
                return action.templates;
            case 'SELECT_TEMPLATE':
                new_state = $.extend(true, {}, state);
                new_state.selected_template = action.selected_template
                return new_state
            case 'CREATE_TEMPLATE':
                new_state = $.extend(true, {}, state);
                for(let i=0; i < new_state.names.length; i++){
                    if(new_state.names[i].toLocaleLowerCase() > action.name.toLocaleLowerCase()){
                        new_state.names.splice(i, 0, action.name) // inserts name into alphabetical index
                        new_state.selected_template = action.name
                        break
                    }
                }
                return new_state
            case 'UPDATE_TEMPLATE':
                new_state = $.extend(true, {}, state);
                new_state[action.template.name] = action.template;
                return new_state;
            default:
                return state;
        }
    }

    static getInitialState() {
        try{
            return vcs.getalltemplatenames().then((names) => {
                return {
                    names: names,
                    selected_template: ""
                }
            })
        }
        catch(e){
            if(e instanceof TypeError && e.message === "vcs.getalltemplatenames is not a function"){
                const message = "Unable to retrieve templates. You may need to update vcs-js. Run: conda install -c cdat vcs-js"
                toast.error(message, { position: toast.POSITION.BOTTOM_CENTER, autoClose: 8000 })
            }
            else{
                console.warn(e)
            }
            return {names: [], selected_template: ""}
        }
        
    }
}

export default TemplateModel
