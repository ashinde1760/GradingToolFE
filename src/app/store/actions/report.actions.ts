import { Action } from '@ngrx/store';
import { IPartnerReport } from '../../util/partnerReportDataUtil';
import { IProjectReport } from '../../util/projectReportDataUtil';
import { ITrainingCenterReport } from '../../util/trainingCenterReportDataUtil';

export enum ReportActions {
    FetchPartnerReportStart = '[Report] Fetch Partner Report Start',
    FetchPartnerReportEnd = '[Report] Fetch Partner Report End',

    FetchProjectReportStart = '[Report] Fetch Project Report Start',
    FetchProjectReportEnd = '[Report] Fetch Project Report End',

    FetchTrainingCenterReportStart = '[Report] Fetch Training Center Report Start',
    FetchTrainingCenterReportEnd = '[Report] Fetch Training Center Report End',

    ReportActionFails = '[Report] Report action fails'
}

export class FetchPartnerReportStart implements Action{
    readonly type = ReportActions.FetchPartnerReportStart;

    constructor(public payload: { reportType: string, partnerId: string, projectId: string}){}
}

export class FetchPartnerReportEnd implements Action{
    readonly type = ReportActions.FetchPartnerReportEnd;

    constructor(public payload: IPartnerReport){}
}

export class FetchProjectReportStart implements Action{
    readonly type = ReportActions.FetchProjectReportStart;

    constructor(public payload: { reportType: string, projectId: string}){}
}

export class FetchProjectReportEnd implements Action{
    readonly type = ReportActions.FetchProjectReportEnd;

    constructor(public payload: IProjectReport){}
}

export class FetchTrainingCenterReportStart implements Action{
    readonly type = ReportActions.FetchTrainingCenterReportStart;

    constructor( public payload: {reportType: string, tcId: string, partnerId: string, projectId: string}){}
}

export class FetchTrainingCenterReportEnd implements Action{
    readonly type = ReportActions.FetchTrainingCenterReportEnd;

    constructor(public payload: ITrainingCenterReport){}
}

export class ReportActionFails implements Action{
    readonly type = ReportActions.ReportActionFails;
    constructor(){}
}

export type ReportActionTypes = 
  FetchPartnerReportStart 
  | FetchPartnerReportEnd
  | FetchProjectReportStart
  | FetchProjectReportEnd
  | FetchTrainingCenterReportStart
  | FetchTrainingCenterReportEnd
  | ReportActionFails;
