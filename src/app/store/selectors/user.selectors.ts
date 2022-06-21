import { AppState } from '../index';

import { createSelector, State} from "@ngrx/store";

const userState = (state: AppState) => state.user



export const loadUsers = createSelector(
  userState,
  (state) => state.users
);


export const getError = createSelector(
  userState,
  state => state.error
);

export const getSuccess = createSelector(
  userState,
  state => state.success
);

export const getUserByRole = createSelector(
  userState,
  (state, props) => {
    return state.users.find(user => {
      return user.role === props.role;
    });
  }
);

export const failedUploadData = createSelector(
  userState,
  (state) => state.failedUploadData
);

export const getProcessState = createSelector(
  userState,
  (state) => state.underProcess
);
