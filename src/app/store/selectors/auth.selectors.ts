import { state } from "@angular/animations";
import {createSelector, State} from "@ngrx/store";
import {AppState} from "../index";

const authState = (state: AppState) => state.auth;


export const isLoggedIn = createSelector(
  authState,
  (state) => state.isLoggedIn
);

export const userJwtToken = createSelector(
  authState,
  (state) => state.user ? state.user.jwtToken : ''
);


export const getError = createSelector(
  authState,
  (state) => state.error
)

export const userRole= createSelector(
  authState,
  state=>{
    return state.user? state.user.userRole :''
  }
)

export const userFirstName=createSelector(
    authState,state=>{
      return state.user.firstName
    }
)

export const oneTimeAccessToken = createSelector(
  authState,
  (state) => {
    return state.user ? state.user.oneTimeAccessToken : '';
  }
)

export const user = createSelector(
  authState,
  (state) => {
    return state.user;
  }
)