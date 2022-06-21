import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { SurveyState } from "../reducers/survey.reducer";

const surveyState = (appState: AppState) => appState.survey

export const getSurveyById = createSelector(
    surveyState,
    (state, props) => {
        return state.surveys.find(survey => survey.surveyId === props.surveyId)
    }
)

export const getAllSurveys = createSelector(
    surveyState,
    (state) => state.surveys
)

