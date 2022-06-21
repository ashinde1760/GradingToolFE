import { AppState } from '..';
import { ListUserStarts, UserActions, ListUsersFinished, AddUserStarts, AddUserEnds, DeleteUserStart, DeleteUserEnds, UpdateUserStarts, UpdateUserEnds, AddUserFails, AddMultipleUsersStarts, AddMultipleUsersEnds, FilterUserStarts, FilterUserEnds, UpdateStatusEnds, UpdateStatusStarts, DownloadTemplateStart, DownloadTemplateEnd, FailedUploadData, UploadDataFails } from './../actions/user.action';
import { User } from './../models/user';
import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { userJwtToken } from '../selectors/auth.selectors';
import { select, Store } from "@ngrx/store";
import { switchMap, tap, map, catchError } from "rxjs/operators";
import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { downloadTemplateUrl, UserUrl, DeleteMultipleUsersUrl } from "./URLs";
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { Router } from '@angular/router';
import { LogoutEnd } from '../actions/auth.actions';
import { getProcessState } from '../selectors/user.selectors';

const MIME_TYPE = {
    pdf: 'application/pdf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export interface FetchAllUser {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    role: string,
    status: string,
    userId: string
}

@Injectable()
export class UserEffects {
    jwtToken: string;
    id: string[] = [];
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private toastr: ToastrService,
        private loadingSpinner: LoadingSpinnerService,
        private router: Router
    ) {}

    // to delete multiple users.
    deleteUsers(userIds: string[]){
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });
        const option = {
            headers: {
                jwtToken: this.jwtToken
            }
        }

        const reqBody = {
            "userIds": userIds
        }
        return this.http.post(DeleteMultipleUsersUrl, reqBody, option);
    }

    // to add single user by entering data manually.
    @Effect()
    addUserStart = this.actions$.pipe(
        ofType<AddUserStarts>(UserActions.AddUserStarts),
        switchMap((user) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.post(UserUrl , user.payload, option).pipe(
                tap((data) => {
                    this.loadingSpinner.isLoading.next(false);
                }),
                map((response) => {        
                   
                    this.toastr.success(response['msg'], 'Success!')
                    return new AddUserEnds({user: new User(
                        user.payload.firstName,
                        user.payload.lastName,
                        user.payload.phone,
                        user.payload.email,
                        user.payload.role,
                        "Un-Verified",
                        response['userId'],
                    ), success:response['msg']});
                    
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage, 'Failed!')
                    return of({
                        type: UserActions.AddUserFails,
                        payload: { errorMessage }
                    });
                })
            );
        })
    );

    // to get the list of users.
    @Effect()
    loadUsers = this.actions$.pipe(
        ofType<ListUserStarts>(UserActions.ListUserStarts),
        switchMap(() => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.get(UserUrl, option).pipe(
                tap((data) => {
                    this.store.select(getProcessState).subscribe((status) =>{
                        if(!status){
                            this.loadingSpinner.isLoading.next(false);  
                        } 
                    });              
                }),
                map((response: { users: FetchAllUser[] }) => {
                    const temp = [];
                    response.users.forEach((user, index) => {
                        temp.push(
                            new User(
                                user.firstName,
                                user.lastName,
                                user.phone,
                                user.email,
                                user.role,
                                user.status,
                                user.userId
                            )
                        );
                    });               
                    return new ListUsersFinished(temp);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);                     
                    this.toastr.error(errorMessage, 'Failed!');
                    return of({
                        type: UserActions.UserActionFails,
                    });
                })
            );
        })
    );

// this method is for deleting the single user but now its not using.
    @Effect()
    deleteUserStart = this.actions$.pipe(
        ofType<DeleteUserStart>(UserActions.DeleteUserStarts),
        tap(() => { }),
        switchMap((userId) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }

            return this.http
                .delete(UserUrl + '/' + userId.payload, option)
                .pipe(
                    tap((data) => {
                    }),
                    map((response) => {
                        this.toastr.success(response['msg'], 'Success!')
                        return new DeleteUserEnds({userId:userId.payload, success:response['msg']});
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.toastr.error(errorMessage,'Failed!');              
                        return of({
                            type: UserActions.DeleteUserFails,
                            payload: { errorMessage }
                        });
                    })
                );
        })
    );

    // to update user data.
    @Effect()
    updateUserStart = this.actions$.pipe(
        ofType<UpdateUserStarts>(UserActions.UpdateUserStarts),
        switchMap((userData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.patch(UserUrl + "/" + userData.payload.userId, userData.payload.user, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response) => {
                        this.toastr.success(response['msg'], 'Success!')
                        // this.store.pipe(select(loadUsers)).subscribe()
                        return new ListUserStarts();
                    }),
                    catchError((error:HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(error.error['message'], 'Failed!');
                        return of({
                            type: UserActions.ListUserStarts
                        });
                    })
                );
        })
    );

    // to add multiple users by uploading the users data file.
    @Effect()
    addMultipleUsers = this.actions$.pipe(
        ofType<AddMultipleUsersStarts>(UserActions.AddMultipleUsersStarts),
        switchMap((userData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.post(UserUrl + "upload", userData.payload, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response: FailedUploadData) => {  
                        if(response.totalRecordsProcessed > 0){
                            this.toastr.success(response['msg'], 'Success!');
                        }                   
                        if(response.failedRecordCount > 0){
                            this.store.dispatch(new AddMultipleUsersEnds());
                            return new UploadDataFails({failedUploadData: response});
                        }
                        this.store.dispatch(new ListUserStarts());
                        return new AddMultipleUsersEnds();
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage, 'Failed!');
                        return of({
                            type: UserActions.AddMultipleUsersFails,
                            payload: { errorMessage }
                        });
                    })
                );
        })
    );

    // to update user's status that would be active/inactive.
    @Effect()
    updateUsersStatus = this.actions$.pipe(
        ofType<UpdateStatusStarts>(UserActions.UpdateStatusStarts),
        switchMap((userData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.patch(UserUrl + "status/"+userData.payload.userId, {"status" : userData.payload.status}, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response) => {
                        this.toastr.success(response['msg'], 'Success!')
                        // return new UpdateStatusEnds({userId: userData.payload.userId, status:userData.payload.status});
                        return new ListUserStarts();
                    }),
                    catchError((error: HttpErrorResponse) =>{
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage, 'Failed!')
                        return of({
                            type: UserActions.ListUserStarts
                        });
                    })                  
                );
        })
    );

    // to get the list after filtering the user by its first name, phone and role.
    @Effect()
    filetreUsers = this.actions$.pipe(
        ofType<FilterUserStarts>(UserActions.FilterUserStarts),
        switchMap((userData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken

                },
                params : {
                    ...typeof(userData.payload.firstName) !== "undefined" && { firstName: userData.payload.firstName},
                    ...typeof(userData.payload.phoneNo) !== "undefined" && {phone: userData.payload.phoneNo},
                    ...typeof(userData.payload.role) !== "undefined" && {role: userData.payload.role}
                }
            }
            return this.http.get(UserUrl + "filter", option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response: { users: FetchAllUser[] }) => {
                        const temp = [];
                        response.users.forEach((user, index) => {
                            temp.push(
                                new User(
                                    user.firstName,
                                    user.lastName,
                                    user.phone,
                                    user.email,
                                    user.role,
                                    user.status,
                                    user.userId
                                )
                            );
                        });
                        return new FilterUserEnds(temp);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage, 'Failed!');                  
                        return of({
                            type: UserActions.UserActionFails,
                        });
                    })
                );
        })
    );

    // to download the empty template to add users data into it.
    @Effect()
    downloadTemplate = this.actions$.pipe(
        ofType<DownloadTemplateStart>(UserActions.DownloadTemplateStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken,                    
                }, 

                params: {
                    fileType: request.payload.fileType
                },

                observe: "response" as "response",
                responseType: 'blob' as 'blob'
            }

            return this.http.get(downloadTemplateUrl, option).pipe(
                map((response) => {
                    let contentDisposition = response.headers.get('content-disposition');
                    const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
                    this.toastr.success("Download Successful",'Success!');
                    saveAs(new Blob([response.body], {type: MIME_TYPE[EXT]}), fileName);
                    return new DownloadTemplateEnd();
                }), catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.toastr.error(errorMessage,"Failed!");
                    return of({
                        type: UserActions.DownloadTemplateEnd,
                    });
                })
            );
        })
    );

}


