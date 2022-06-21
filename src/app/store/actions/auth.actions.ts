import {Action} from "@ngrx/store";
import {UserModel} from "../models/user.model";

export enum AuthActions {
  LoginStart = '[Auth] Login Start',
  LoginEnd = '[Auth] Login End',
  LoginFail = '[Auth] Login Fail',
  LogoutStart = '[Auth] Logout Start',
  LogoutEnd = '[Auth] Logout End'

}

export class LoginStart implements Action {
  readonly type = AuthActions.LoginStart;

  constructor(public payload: { emailId: string, password: string }) {
  }
}

export class LoginEnd implements Action {
  readonly type = AuthActions.LoginEnd;

  constructor(public payload: UserModel) {
  }
}

export class LogoutStart implements Action {
  readonly type = AuthActions.LogoutStart;
}

export class LogoutEnd implements Action {
  readonly type = AuthActions.LogoutEnd;
}

export class LoginFail implements Action {
  readonly type = AuthActions.LoginFail;

  constructor(public payload: string) {
  }
}

export type AuthActionTypes = LoginStart | LoginEnd | LogoutStart | LogoutEnd | LoginFail;
