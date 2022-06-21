import { Action } from "@ngrx/store";

export class DownloadReportRequest{
    constructor(
        public userId: string,
        public projectId: string,
        public tcId: string
    ){}
}

export enum DownloadReportActions {

    DownloadProjectReportStart = "[Download Report] Download project Report Starts",
    DownloadPartnerReportStart = "[Download Report] Download partner Report Starts",
    DownloadTrainingCenterReportStart = "[Download Report] Download traing center Report Starts",
    DownloadReportFinished = "[Download Report] Download Report Finished",
    DownloadAttachmentStart = "[Download Attachment] Download Attachment Start"
}


export class DownloadProjectReportStart implements Action {
    readonly type = DownloadReportActions.DownloadProjectReportStart;
    constructor(public payload: { reportType: string, projectId: string}) {
    }
}

export class DownloadPartnerReportStart implements Action {
    readonly type = DownloadReportActions.DownloadPartnerReportStart;
    constructor(public payload: { reportType: string, partnerId: string, projectId: string}) {
    }
}

export class DownloadTrainingCenterReportStart implements Action {
    readonly type = DownloadReportActions.DownloadTrainingCenterReportStart;
    constructor(public payload: { reportType: string, tcId: string, partnerId: string, projectId: string}) {
    }
}

export class DownloadReportFinished implements Action {
    readonly type = DownloadReportActions.DownloadReportFinished;
    constructor(public payload: string) {
    }
}

export class DownloadAttachmentStart implements Action {
    readonly type = DownloadReportActions.DownloadAttachmentStart;
    constructor(public payload: {reportType: string, projectId: string, partnerId: string, tcId: string}){}
}

export type DownloadReportActionTypes =
    DownloadReportFinished
    | DownloadProjectReportStart
    | DownloadPartnerReportStart
    | DownloadTrainingCenterReportStart
    | DownloadAttachmentStart;