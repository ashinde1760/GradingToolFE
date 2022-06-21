import {SurveyData} from "../../util/FormType";

export class SurveyModel {

  constructor(
    private _formName: string,
    private _lastUpdate: string,
    private _surveyData: SurveyData[]
  ) {
  }
}

