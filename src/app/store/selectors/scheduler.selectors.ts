import { AppState } from "..";
import { createSelector } from "@ngrx/store";

const schedulerState = (state: AppState) => state.scheduler


export const loadSchedulerDetails = createSelector(
    schedulerState,
    (state) => state.scheduler
);