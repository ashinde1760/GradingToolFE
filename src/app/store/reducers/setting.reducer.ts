import * as settingActions from './../actions/setting.actions';

export interface SettingState {
    accountData: settingActions.AccountResponse;
    error:string;
    success:string;
}

const initialState: SettingState = {
    accountData: null,
    error: '',
    success: ''
};

export function settingReducer(state: SettingState = initialState, action: settingActions.SettingActionTypes): SettingState {
    switch (action.type) {
        case settingActions.SettingActions.LoadAccountFinished: {
          return {
            ...state,
            accountData: action.payload,
          };
        }
        default:
        return state;
    }
}