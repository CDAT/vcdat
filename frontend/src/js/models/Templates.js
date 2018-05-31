import BaseModel from './BaseModel.js'
import { toast } from 'react-toastify'
import $ from 'jquery'

class TemplateModel extends BaseModel {
    static reduce(state={}, action) {
        let new_state;
        switch (action.type) {
            case 'INITIALIZE_TEMPLATE_VALUES':
                return action.templates;
            case 'CREATE_TEMPLATE':
                new_state = $.extend(true, [], state);
                for(let i=0; i < new_state.length; i++){
                    if(new_state[i].toLocaleLowerCase() > action.name.toLocaleLowerCase()){
                        new_state.splice(i, 0, action.name) // inserts name into alphabetical index
                        break
                    }
                }
                return new_state
            case 'REMOVE_TEMPLATE':
                new_state = $.extend(true, [], state);
                new_state.splice(new_state.indexOf(action.name), 1)
                return new_state
            case 'UPDATE_TEMPLATE':
                new_state = $.extend(true, [], state);
                new_state[action.template.name] = action.template;
                return new_state;
            default:
                return state;
        }
    }

    static getInitialState() {
        try{
            return vcs.getalltemplatenames().then((names) => {
                return names.filter((name) => {return !name.startsWith("__")}) // ["ASD", "default"] etc. filter out temp names like "__boxfill_12345"
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
            return []
        }
        
    }
}

export default TemplateModel
