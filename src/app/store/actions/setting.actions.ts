import { Action } from "@ngrx/store";

export class AccountResponse {
    constructor(
       public firstName: string,
       public lastName: string,
       public centerId: string,
       public role: string,
       public phone: string,
       public userId: string,
       public email: string,
       public status: string
    ){}
}

export enum SettingActions {

    LoadAccountStarts = "[Setting] Load Account Starts",
    LoadAccountFinished = "[Setting] Load Account Finished",

    UpdateSettingStarts = "[Setting] Update Setting Starts",
    UpdateSettingEnds = "[Setting] Update Setting Ends",

    SettingActionFailed = "[Setting] setting action fails"
}

export class Setting {    
}

export class LoadAccountStarts implements Action {
    readonly type = SettingActions.LoadAccountStarts;
    constructor() {}
}

export class LoadAccountFinished implements Action {
    readonly type = SettingActions.LoadAccountFinished;
    constructor(public payload: AccountResponse) {}
}

export class UpdateSettingStarts implements Action {
    readonly type = SettingActions.UpdateSettingStarts;
    constructor(public payload: {requestActionType: string, userId: string, requestBody: any}) {
    }
}

export class UpdateSettingEnds implements Action {
    readonly type = SettingActions.UpdateSettingEnds;
    constructor(public payload: any) {
    }
}

export class SettingActionFailed implements Action {
    readonly type = SettingActions.SettingActionFailed;
    constructor(){}
}

export type SettingActionTypes =
    LoadAccountStarts
    | LoadAccountFinished
    | UpdateSettingStarts
    | UpdateSettingEnds
    | SettingActionFailed;