import { Action } from "@ngrx/store";
import { FormType } from "../../util/FormType";
import { FetchAllSurveyResponsePayloadType } from '../effects/survey.effects';

// this is related to survay action
export enum SurveyActions {
  FetchSurveyStart = '[Survey] Fetch Survey Start',
  FetchSurveyEnd = '[Survey] Fetch Survey End',
  CreateSurveyStart = '[Survey] Create Survey Start',
  CreateSurveyEnd = '[Survey] Create Survey End',

  SurvayActionFailed = '[Survey] Survey Action Failed'
}

export class FetchSurveyStart implements Action {
  readonly type = SurveyActions.FetchSurveyStart
  constructor(public surveyId:string,public preview?:boolean){

  }
}

export class FetchSurveyEnd implements Action {
  readonly type = SurveyActions.FetchSurveyEnd
  constructor(public payload: FetchAllSurveyResponsePayloadType) { }
}

export class CreateSurveyStart implements Action {
  readonly type = SurveyActions.CreateSurveyStart

  constructor(public payload: { surveyId: string, surveyData: FormType }) {
  }
}

export class CreateSurveyEnd implements Action{
  readonly type =SurveyActions.CreateSurveyEnd
}

export class SurvayActionFailed implements Action{
  readonly type = SurveyActions.SurvayActionFailed
}


export type SurveyActionTypes = CreateSurveyStart | FetchSurveyStart | FetchSurveyEnd | SurvayActionFailed;
