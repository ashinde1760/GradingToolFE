import { LoginFail } from './../actions/auth.actions';
import {UserModel} from "../models/user.model";
import {AuthActions, AuthActionTypes} from "../actions/auth.actions";

export interface AuthState {
  user: UserModel;
  isLoggedIn: boolean;
  error: string;
}

const initialState: AuthState = {
  user: localStorage.getItem('auth')?new UserModel(JSON.parse(atob(localStorage.getItem('auth'))).firstName,JSON.parse(atob(localStorage.getItem('auth'))).lastName,JSON.parse(atob(localStorage.getItem('auth'))).role,JSON.parse(atob(localStorage.getItem('auth'))).jwtToken,JSON.parse(atob(localStorage.getItem('auth'))).status,JSON.parse(atob(localStorage.getItem('auth'))).accessToken,JSON.parse(atob(localStorage.getItem('auth'))).oneTimeAccessToken):null,
  isLoggedIn:  localStorage.getItem('auth')?true:false,
  error: '',
};

export function authReducer(state: AuthState = initialState, action: AuthActionTypes): AuthState {
  switch (action.type) {
    case AuthActions.LoginEnd: {
      return {
        ...state,
        user: action.payload,
        isLoggedIn: action.payload.status === "Verified" ? true : false,
        error: ''
      };
    }
    case AuthActions.LogoutEnd: {
      localStorage.removeItem('auth')
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    }
    case AuthActions.LoginFail: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        error: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
