import { AppState } from "../index";
import { createSelector } from "@ngrx/store";

const settingState = (state: AppState) => state.setting


export const AccountDetails = createSelector(
    settingState,
    (state) => state.accountData
)