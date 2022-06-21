import { FormModel } from 'src/app/store/models/form.model';
import { Action } from '@ngrx/store';
export enum FormActions {
    CreateFormStart = '[Form] Create Form Start',
    CreateFormEnd = '[Form] Create Form End',
    FormFetchStart = '[Form] Form Fetch Start',
    FormFetchEnd = '[Form] Form Fetch End',
    SelectForm = '[Form] Select Form',
    UpdateFormStart ='[Form] Update Form Start',
    UpdateFormEnd='[Form] Update Form End',
    DeleteFormStart='[Form] Delete Form Start',
    DeleteFormEnd='[Form] Delete Form End',
    PublishFormStart='[Form] Publish Form Start',  
    
    FormActionFailed = '[Form] Form Action Failed'
  }

  export class CreateFormStart implements Action {
    readonly type = FormActions.CreateFormStart;
  
    constructor(public payload: FormModel) {
    }
  }
  
  export class CreateFormEnd implements Action {
    readonly type = FormActions.CreateFormEnd;
  
    constructor(public payload: FormModel) {
    }
  }

  export class FormFetchStart implements Action{
    readonly type = FormActions.FormFetchStart

    constructor(public payload:number){
      
    }
  }
  export class FormFetchEnd implements Action{
    readonly type = FormActions.FormFetchEnd

    constructor(public payload:FormModel[]){

    }
  }

  export class SelectForm implements Action{
    readonly type = FormActions.SelectForm

    constructor(public payload:{formId:string,surveyId:string,formName:string}){

    }
  }

  export class UpdateFormStart implements Action{
    readonly type = FormActions.UpdateFormStart

    constructor(public payload:FormModel){

    }
  }
  export class UpdateFormEnd implements Action{
    readonly type = FormActions.UpdateFormEnd
    constructor(public payload:FormModel[],public formName?:string){

    }
  }
  export class DeleteFormStart implements Action{
    readonly type = FormActions.DeleteFormStart
    constructor(public payload:string){

    }
  }
  export class DeleteFormEnd implements Action{
    readonly type = FormActions.DeleteFormEnd
    constructor(public payload:FormModel[]){

    }
  }

  export class PublishFormStart implements Action{
    readonly type = FormActions.PublishFormStart;
    constructor(public payload: {formId: string, id: number}){

    }
  }

  export class FormActionFailed implements Action{
    readonly type = FormActions.FormActionFailed;
    constructor(){}
  }

  export type FormtActionTypes =
  CreateFormStart
  |CreateFormEnd
  |FormFetchStart
  |FormFetchEnd
  |SelectForm
  |UpdateFormStart
  |UpdateFormEnd
  |DeleteFormStart
  |DeleteFormEnd
  |PublishFormStart
  |FormActionFailed;