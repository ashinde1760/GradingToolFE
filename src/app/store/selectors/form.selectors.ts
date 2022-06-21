import {createSelector} from "@ngrx/store";
import {AppState} from "../index";
import { FormModel } from "../models/form.model";

const formState = (state: AppState) => state.form

export const formsArraySelector=createSelector(formState,(formState=>{
     return formState.forms
}))

export const selectedFormData=createSelector(formState,(formState=>{
     return formState.selectedForm
}))
// { _formName: formObject.formName,
//      _userRole: formObject.userRolesAllowed,
//      _projectId: formObject.projectId,
//      _formId:formObject.formId,
//      _surveyId: formObject.surveyId 
//    }