import { Action } from "@ngrx/store";

export interface PartnerWithTrainingCenters {
    "clientSponsorContact": string,
    "clientSponsorEmail": string,
    "clientSponsorFirstName":string,
    "partnerName": string,
    "clientSponsorId": string,
    "partnerId": string,
    "clientSponsorLastName": string
}

export class TrainingCenterDetail {
    constructor(
        public tcId: string,
        public tcName: string,
        public centerAddress: string,
        public district: string,
        public centerInchargeId: string,
        public centerContact: string,
        public latitude: string,
        public longitude: string){}

}

export enum PartnerActions {

    ListPartnerStarts = "[Partner] List Partner Starts",
    ListPartnerFinished = "[Partner] List Partner Finished",
    ListofClientSponserStart="[Partner] List Of ClientSponor Start",
    ListofClientSponserFinished="[Partner] List Of ClientSponor Finished",
    listofTrainigCenterStart="[Partner] List Of Training Center Start",
    listofTrainigCenterFinished="[Partner] List Of Training Center Finished",
    listofCenterInchargeStart="[Partner] List Of CenterIncharge Start",
    listofCenterInchargeFinished="[Partner] List Of CenterIncharge Finished",
    clearPartnersData="[Partner] Clear Master Data"
}

export class ListPartnerStarts implements Action {
    readonly type = PartnerActions.ListPartnerStarts;
}
export class ListPartnerFinished implements Action {
    readonly type = PartnerActions.ListPartnerFinished;
    constructor(public payload: PartnerWithTrainingCenters[]) {
    }
}

export class ListofClientSponsorStart implements Action{
    readonly type = PartnerActions.ListofClientSponserStart
}

export class ListofClientSponsorEnd implements Action{
    readonly type = PartnerActions.ListofClientSponserFinished
    constructor(public payload:[]){

    }
}

export class ListofCenterInchargeStart implements Action{
    readonly type = PartnerActions.listofCenterInchargeStart
}

export class ListofCenterInchargeEnd implements Action{
    readonly type = PartnerActions.listofCenterInchargeFinished
    constructor(public payload:[]){

    }
}
export class ListofTrainingCenterStart implements Action{
    readonly type = PartnerActions.listofTrainigCenterStart
    constructor(public payload:string){

    }
}

export class ListofTrainingCenterEnd implements Action{
    readonly type = PartnerActions.listofTrainigCenterFinished
    constructor(public payload:[]){

    }
}

export class ClearPartnerData implements Action{
    readonly type = PartnerActions.clearPartnersData
}


export type PartnerActionTypes =
    ListPartnerStarts
    | ListPartnerFinished |ListofCenterInchargeEnd|ListofCenterInchargeStart|ListofClientSponsorEnd|ListofClientSponsorStart|ListofTrainingCenterEnd|ListofTrainingCenterStart|ClearPartnerData;