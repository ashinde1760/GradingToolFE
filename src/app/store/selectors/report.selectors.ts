import { createSelector } from "@ngrx/store";
import { AppState } from "../index";

const reportState = (state: AppState) => state.report;


export const getReportState = createSelector(
  reportState,
  (state) => state
);