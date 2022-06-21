import { FormActions } from './../actions/form.actions';
import { FormtActionTypes } from '../actions/form.actions';
import { FormModel } from './../models/form.model';
export interface FormState {
    forms:FormModel[],
    selectedForm:{
        formId:string,
        surveyId:string,
        formName:string
    }
}

const initialState: FormState = {
    forms: [],
    selectedForm:null,
    
};

export function formReducer(state: FormState = initialState, action: FormtActionTypes): FormState {
    switch (action.type) {
        case FormActions.CreateFormEnd:
            return {
                ...state,
                forms: [...state.forms,{...action.payload}],
                selectedForm:{
                    formId:action.payload._formId,
                    surveyId:action.payload._surveyId,
                    formName:action.payload._formName
                }
            };
        case FormActions.FormFetchEnd:
            return {
                ...state,
                forms:[...action.payload]
            } 
        case FormActions.SelectForm:
            return {
                ...state,
                selectedForm:{...action.payload}
            }  
            ;
        case FormActions.UpdateFormEnd:
            return {
                ...state,
                forms:[...action.payload],
                selectedForm:{
                    ...state.selectedForm,
                    formName:action.formName
                }
            };
        case FormActions.DeleteFormEnd:
            return {
                ...state,
                forms:[...action.payload]
            }
        default:
            return state;
    }
}