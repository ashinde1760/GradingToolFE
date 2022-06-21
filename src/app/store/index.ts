import { partnerReducer, PartnerState } from './reducers/partner.reducer';
import { masterDataReducer, MasterDataState } from './reducers/master-data.reducer';
import { userReducer, UserState } from './reducers/user.reducer';
import { formReducer, FormState } from './reducers/form.reducer';
import { projectReducer, ProjectState } from './reducers/project.reducer';
import {   ActionReducer,
  ActionReducerMap,
  MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from "./reducers/auth.reducer";
import { SurveyState, surveyReducer } from './reducers/survey.reducer';
import { SchedulerState, schedulerReducer } from './reducers/scheduler.reducer';
import {SettingState,settingReducer} from './reducers/setting.reducer';
import { reportReducer, ReportState } from './reducers/report.reducer';
import { downloadReportReducer, DownloadReportState} from './reducers/download-report.reducer';



export interface AppState {
  projects: ProjectState;
  auth: AuthState;
  survey: SurveyState;
  form: FormState;
  user: UserState;
  masterData: MasterDataState;
  partner: PartnerState;
  report: ReportState
  scheduler: SchedulerState,
  setting:SettingState,
  downloadReport: DownloadReportState
}

export const appReducer: ActionReducerMap<AppState> = {
  projects: projectReducer,
  auth: authReducer,
  survey: surveyReducer,
  form: formReducer,
  user: userReducer,
  masterData: masterDataReducer,
  partner: partnerReducer,
  report: reportReducer,
  scheduler: schedulerReducer,
  setting: settingReducer,
  downloadReport: downloadReportReducer
};
