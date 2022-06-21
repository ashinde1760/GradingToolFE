import { AppState } from '../index';
import { createSelector } from "@ngrx/store";
import { state } from '@angular/animations';

const masterDataState = (state: AppState) => state.masterData


export const loadMasterData = createSelector(
  masterDataState,
  (state) => state.masterData
);

export const failedUploadData = createSelector(
  masterDataState,
  (state) => state.failedUploadData
);

export const getLoadingProcessState = createSelector(
   masterDataState,
   (state) => state.inProcess
);

