import { Action } from "@ngrx/store";

export class Scheduler {
    constructor(
        public selfAssignmentStatus: boolean,
        public partnerName: string,
        public fieldAuditorId: string,
        public isAuditCancel: boolean,
        public fieldAuditorName: string,
        public projectMappingId: string,
        public selfAssignmentDate: Date,
        public tcName: string,
        public auditStatus: boolean,
        public partnerId: string,
        public tcId: string,
        public projectName: string,
        public projectId: string,
        public auditDate: Date,
        public centerInchargeName: string,
        public formName: string,
        public clientSponsorName: string,
        public clientSponsorContact: string,
        public formId: string,
        public fieldAuditorContact: string
    ) { }

    public setFieldAuditorContact (contact: string){
        this.fieldAuditorContact = contact
    }
}

export class UpdateScheduler {
    constructor(
        public fieldAuditorId: string,
        public isAuditCancled: string,
        public auditStatus: boolean,
        public auditDate: Date
    ) {}
}

export interface FilterRequestForScheduler {
    projectName?: string,
    partnerName?: string,
    schedulerType: string
}

export enum SchedulerActions {

    ListSchedulerStarts = "[Scheduler] List Scheduler Starts",
    ListSchedulerFinished = "[Scheduler] List Scheduler Finished",

    FilterByStarts = "[Scheduler] Filter By Starts",
    FilterByEnds = "[Scheduler] Filter By Ends",

    UpdateSchedulerStarts = "[Scheduler] Update Scheduler Starts",
    UpdateSchedulerEnds = "[Scheduler] Update Scheduler Ends",

    FailedSchedularAction = "[Schedular] Failed Schedular Action"
}

export class ListSchedulerStarts implements Action {
    readonly type = SchedulerActions.ListSchedulerStarts;

    constructor(public payload: {schedulerType: string}) {

    }
}

export class ListSchedulerFinished implements Action {
    readonly type = SchedulerActions.ListSchedulerFinished;

    constructor(public payload: Scheduler[]) {

    }
}

export class FilterByStarts implements Action {
    readonly type = SchedulerActions.FilterByStarts;
    constructor(public payload: FilterRequestForScheduler) {

    }
}

export class FilterByEnds implements Action {
    readonly type = SchedulerActions.FilterByEnds;
    constructor(public payload: Scheduler[]) {

    }
}

export class UpdateSchedulerStarts implements Action {
    readonly type = SchedulerActions.UpdateSchedulerStarts;
    constructor(
        public payload: 
        { 
            schedulerType: string, 
            reqBody: {
                "projectId": string,
                "partnerId": string,
                "formId": string,
                "tcId"?: string,
                "fieldAuditorId": string,
                "isAuditCancel": boolean,
                "auditStatus": boolean,
                "auditDate": string
              }
        }) {

    }
}

export class UpdateSchedulerEnds implements Action{
    readonly type = SchedulerActions.UpdateSchedulerEnds;
    constructor(public payload: Scheduler) { }
}

export class FailedSchedularAction implements Action{
    readonly type = SchedulerActions.FailedSchedularAction
    constructor(){}
}

export type SchedulerActionTypes =
    ListSchedulerStarts
    | ListSchedulerFinished
    | FilterByStarts
    | FilterByEnds
    | FailedSchedularAction;