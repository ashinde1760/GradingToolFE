import { Action } from "@ngrx/store";
import { dataObject } from "src/app/util/masterDataUtil";
import { masterDataReducer } from "../reducers/master-data.reducer";

export class AddIndividualPayloadType {

  projectDetails: ProjectDetailsPayloadType;
  partnerDetails: PartnerDetailsPayloadType;

}

export class ProjectDetailsPayloadType {
  projectName?: string
  projectId?: string
}

export interface PartnerDetailsPayloadType {
  partnerId?: string,
  partnerName?: string,
  headPerson?: string,
  contact?: string,
  traningCentersDetails: TrainingCenetrPayloadType
}

export interface TrainingCenetrPayloadType {
  tcId?: string,
  tcName?: string,
  centerAddress: string,
  district: string,
  centerInchargeId: string,
  centerContact: string
  latitude: string,
  longitude: string
}

export interface FailedUploadData{
  failureRecords: FailureRecords[],
  totalRecord: number,
  failuresRecordsCount: number
}

export interface FailureRecords{
  rowNumber: number,
  partnerName: string,
  trainingCenterId: string,
  errorMsg: string,
}

export class PartnerPayloadType {
  constructor(
    public partnerName: string,
    public headPerson: string,
    public patnerContact: string,
    public tcName: string,
    public centerAddress: string,
    public district: string,
    public centerInchargeName: string,
    public centerContact: string,
    public latitude: string,
    public longitude: string,
    public projectName: string,
    public projectMappingId: string
  ) { }

}

export interface FilterRequest {
  projectName?: string,
  partnerName?: string,
  tcId?: string
}

export enum MasterDataActions {
  AddIndividualStart = '[Master Data] Add Individual Start',
  AddIndividualEnd = '[Master Data] Add Individual End',
  AddIndividualFails = '[Master Data] Add Individual Fails',

  ListMasterDataStarts = "[Master Data] List Master Data Starts",
  ListMasterDataFinished = "[Master Data] List Master Data Finished",
  AddEmptyRowForMasterData = "[Master Data] Add Empty Row ",
  DeleteStarts = "[Master Data] Delete Starts",
  DeleteEnds = "[Master Data] Delete Ends",
  DeleteFails = "[Master Data] Delete Fails",

  FilterStarts = "[Master Data] Filter Starts",
  FilterEnds = "[Master Data] Filter Ends",

  UpdateIndividualStart = "[Master Data] Update Starts",
  UpdateIndividualEnd = "[Master Data] Update Ends",

  AddMultipleEnds ="[Master Data] Add Multiple Ends",
  AddMultipleStarts ="[Master Data] Add Multiple Starts",
  AddMultipleFails ="[Master Data] Add Multiple Fails",
  clearMasterData="[Master Data] Clear Master Data",
  updateFailed="[MasterData] Update Failed",

  DownloadTemplateStart = "[Master Data] Download File Start",
  DownloadTemplateEnd = "[Master Data] Download File End",

  UploadDataFails = '[Master Data] Upload Data fails',
  ResetFailedUploadedData = '[Master Data} Upload Data reset',

  MasterActionFails = '[Master Data] Master Action Fails'
}


export class AddIndividualStart implements Action {
  readonly type = MasterDataActions.AddIndividualStart;
  constructor(public payload:dataObject) { }
}

export class AddIndividualEnd implements Action {
  readonly type = MasterDataActions.AddIndividualEnd;
  constructor(public payload: { success: string }) { }
}

export class AddIndividualFails implements Action {
  readonly type = MasterDataActions.AddIndividualFails;
  constructor(public payload: string) { }
}

export class ListMasterDataStarts implements Action {
  readonly type = MasterDataActions.ListMasterDataStarts;
}
export class ListMasterDataFinished implements Action {
  readonly type = MasterDataActions.ListMasterDataFinished;
  constructor(public payload: dataObject[]) {
  }
}

export class AddEmptyRowForMasterData implements Action {
  readonly type = MasterDataActions.AddEmptyRowForMasterData;
  constructor(public payload: PartnerPayloadType) { }
}

export class DeleteStart implements Action {
  readonly type = MasterDataActions.DeleteStarts;
  constructor(public payload: string[]) { }
}

export class DeleteEnds implements Action {
  readonly type = MasterDataActions.DeleteEnds;
  constructor(public payload: {deleteEntries: string[], success: string }) { }
}

export class DeleteFails implements Action {
  readonly type = MasterDataActions.DeleteFails;
  constructor(public payload: string) {
  }
}


export class FilterStarts implements Action {
  readonly type = MasterDataActions.FilterStarts;
  constructor(public payload: FilterRequest) {

  }
}

export class FilterEnds implements Action {
  readonly type = MasterDataActions.FilterEnds;
  constructor(public payload:dataObject[]) {

  }
}

export class UpdateIndividualStart implements Action {
  readonly type = MasterDataActions.UpdateIndividualStart;
  constructor(public payload: { projectMappingId: string, masterData: dataObject }) { }
}

export class UpdateIndividualEnd implements Action {
  readonly type = MasterDataActions.UpdateIndividualEnd;
  constructor(public payload:{ success:string} ) { }
}

export class AddMultipleStarts implements Action {
  readonly type = MasterDataActions.AddMultipleStarts;
  constructor(public payload: {projectId:string,data:any} ) {}
}

export class AddMultipleEnds implements Action {
  readonly type = MasterDataActions.AddMultipleEnds;
  constructor() {}
}


export class ClearMasterData implements Action {
  readonly type = MasterDataActions.clearMasterData;
  
}

export class AddMultipleFails implements Action {
  readonly type = MasterDataActions.AddMultipleFails;
  constructor(public payload: string) { }
}

export class UpdateIndividualFails implements Action{
  readonly type=MasterDataActions.updateFailed
}

export class DownloadTemplateStart implements Action{
  readonly type = MasterDataActions.DownloadTemplateStart;
  constructor(public payload: {fileType: string}) { }
}

export class DownloadTemplateEnd implements Action{
  readonly type = MasterDataActions.DownloadTemplateEnd;
  constructor() { }
}


export class UploadDataFails implements Action{
  readonly type = MasterDataActions.UploadDataFails;
  constructor(public payload: {failedUploadData: FailedUploadData}){}
}

export class ResetFailedUploadedData implements Action{
  readonly type = MasterDataActions.ResetFailedUploadedData;
  constructor(){}
}

export class MasterActionFails implements Action{
  readonly type = MasterDataActions.MasterActionFails;
  constructor(){}
}


export type MasterDataActionTypes =
  AddIndividualStart
  | AddIndividualEnd
  | AddIndividualFails
  | ListMasterDataStarts
  | ListMasterDataFinished
  | AddEmptyRowForMasterData
  | DeleteStart
  | DeleteEnds
  | DeleteFails
  | FilterStarts
  | FilterEnds
  | UpdateIndividualStart
  | UpdateIndividualEnd 
  | UpdateIndividualFails
  | AddMultipleEnds
  | AddMultipleFails
  | AddMultipleStarts
  | ClearMasterData
  | DownloadTemplateStart
  | DownloadTemplateEnd
  | UploadDataFails
  | ResetFailedUploadedData
  | MasterActionFails;