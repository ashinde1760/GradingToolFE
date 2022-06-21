import { Action } from '@ngrx/store';
import { User } from "../models/user";

// this is for user action.
export enum UserActions {
  ListUserStarts = "[user] List User Starts",
  ListUserFinished = "[user] List User Finished",

  AddUserStarts = "[user] Add User Starts",
  AddUserEnds = "[user] Add User Ends",
  AddEmptyRow = "[user] Add row",
  AddEmptyRowEnds = "[user] Add row ends",
  AddUserFails ="[user] Add User Fails", 
  AddMultipleUsersEnds ="[user] Add Multiple User Ends",
  AddMultipleUsersStarts ="[user] Add Multiple User Starts",
  AddMultipleUsersFails ="[user] Add Multiple User Fails",

  DeleteUserStarts = "[user] Delete User Starts",
  DeleteUserEnds = "[user] Delete User Ends",
  DeleteUserFails ="[user] Delete User Fails", 


  UpdateUserStarts = "[user] Update User Starts",
  UpdateUserEnds = "[user] Update User Ends",

  FilterUserStarts ="[user] Filter User Starts",
  FilterUserEnds="[user] Filter User Ends",
  UpdateStatusStarts ="[user] Update Status Starts",
  UpdateStatusEnd ="[user] Update Status End",

  DownloadTemplateStart = "[user] Download File Start",
  DownloadTemplateEnd = "[user] Download File End",

  UploadDataFails = '[user] Upload Data fails',
  ResetFailedUploadedData = '[user] Upload data reset',

  UserActionFails = '[User] User Action Fails',
  RemoveUserRow = '[User] User row removed'

}

export interface UserPayloadType {

  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  role: string
}

export interface DeleteResponse {
  message: string,
  status: string
}

export interface FilterUserRequest {
  firstName?: string,
  phoneNo?: string,
  role?: string
}

export interface FailedUploadData{
  failedRecords: FailureRecords[],
  totalRecordsProcessed: number,
  failedRecordCount: number
}

export interface FailureRecords{
  rowNumber: number,
  firstName: string,
  email: string,
  userRole: string,
  errorMsg: string,
}

export class AddMultipleUsersStarts implements Action {
  readonly type = UserActions.AddMultipleUsersStarts;
  constructor(public payload: any ) {}
}

export class AddMultipleUsersEnds implements Action {
  readonly type = UserActions.AddMultipleUsersEnds;
  constructor() {}
}

export class AddMultipleUsersFails implements Action {
  readonly type = UserActions.AddMultipleUsersFails;
  constructor(public payload: string) { }
}

export class AddUserStarts implements Action {
  readonly type = UserActions.AddUserStarts;
  constructor(public payload: UserPayloadType) { }
}

export class AddUserEnds implements Action {
  readonly type = UserActions.AddUserEnds;
  constructor(public payload: {user:User, success:string}) { }
}
export class AddUserFails implements Action{
  readonly type = UserActions.AddUserFails;
  constructor(public payload: string){

  }
}

export class AddEmptyRow implements Action {
  readonly type = UserActions.AddEmptyRow;
  constructor(public payload: User) { }
}

export class AddEmptyRowEnds implements Action {
  readonly type = UserActions.AddEmptyRowEnds;
  constructor(public payload: User[]) { }
}

export class DeleteUserStart implements Action {
  readonly type = UserActions.DeleteUserStarts;
  constructor(public payload: string ) { }
}

export class DeleteUserEnds implements Action {
  readonly type = UserActions.DeleteUserEnds;
  constructor(public payload: {userId:string,success:string} ) { }
}

export class DeleteUserFails implements Action{
  readonly type = UserActions.DeleteUserFails;
  constructor(public payload: string){

  }
}

export class UpdateUserStarts implements Action {
  readonly type = UserActions.UpdateUserStarts;
  constructor(public payload: { userId: string, user: User }) { }
}

export class UpdateUserEnds implements Action {
  readonly type = UserActions.UpdateUserEnds;
  constructor(public payload:{user:Partial<User>, success:string} ) { }
}

export class ListUserStarts implements Action {
  readonly type = UserActions.ListUserStarts;
}
export class ListUsersFinished implements Action {
  readonly type = UserActions.ListUserFinished;

  constructor(public payload: User[]) {

  }
}

export class FilterUserStarts implements Action {
  readonly type = UserActions.FilterUserStarts;
  constructor(public payload: FilterUserRequest){

  }
}

export class FilterUserEnds implements Action{
  readonly type = UserActions.FilterUserEnds;
  constructor (public payload : User[]){

  }
}

export class UpdateStatusStarts implements Action{
  readonly type= UserActions.UpdateStatusStarts;
  constructor(public payload : {userId: string, status: string}){

  }
}

export class UpdateStatusEnds implements Action{
  readonly type= UserActions.UpdateStatusEnd;
  constructor(public payload : {userId:string, status: string}){

  }
}

export class DownloadTemplateStart implements Action{
  readonly type = UserActions.DownloadTemplateStart;
  constructor(public payload: {fileType: string}) { }
}

export class DownloadTemplateEnd implements Action{
  readonly type = UserActions.DownloadTemplateEnd;
  constructor() { }
}

export class UploadDataFails implements Action{
  readonly type = UserActions.UploadDataFails;
  constructor(public payload: {failedUploadData: FailedUploadData}){}
}

export class ResetFailedUploadedData implements Action{
  readonly type = UserActions.ResetFailedUploadedData;
  constructor(){}
}

export class UserActionFails implements Action{
  readonly type = UserActions.UserActionFails;
  constructor(){}
}

export class RemoveUserRow implements Action{
  readonly type = UserActions.RemoveUserRow;
  constructor(){}
}

export type UserActionTypes =
  ListUserStarts
  | ListUsersFinished
  | AddUserStarts
  | AddUserEnds
  | DeleteUserStart
  | DeleteUserEnds
  | AddEmptyRow
  | UpdateUserEnds
  | UpdateUserStarts
  | AddUserFails
  | AddMultipleUsersEnds
  | AddMultipleUsersStarts
  | FilterUserStarts
  | FilterUserEnds
  | DeleteUserFails
  | AddMultipleUsersFails
  | UpdateStatusStarts
  | UpdateStatusEnds
  | DownloadTemplateStart
  | DownloadTemplateEnd
  | UploadDataFails
  | ResetFailedUploadedData
  | UserActionFails
  | RemoveUserRow;





// export const createUser = createAction(
//   '[User] Create User',
//   props<{ user:User }>()
// );

// export const deleteUser = createAction(
//     '[User] Delete User',
//     props<{ userId:string }>()
//   );

//   export const listUser = createAction(
//     '[User] List User',
//     props<{ user:User[] }>()
//   );

//   export const editUser = createAction(
//     '[User] Edit User',
//     props<{userId:string; user: User }>()
//   )