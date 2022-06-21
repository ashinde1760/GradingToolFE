import { SurveyActions, SurveyActionTypes } from "../actions/survey.actions";
import { IndividualSurveyType } from "../effects/survey.effects";

export interface SurveyState {
  surveys: IndividualSurveyType,
  isEditing: boolean
}

const initialState: SurveyState = {
  surveys: null,
  isEditing: false
}

export const surveyReducer = (state: SurveyState = initialState, action: SurveyActionTypes): SurveyState => {
  switch (action.type) {
    case SurveyActions.FetchSurveyEnd: {
      return {
        ...state,
        surveys: action.payload.survey
      }
    }

    default: {
      return state;
    }
  }
}
