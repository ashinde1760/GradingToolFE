import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { AppState } from "..";
import * as SettingActions from "src/app/store/actions/setting.actions";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { userJwtToken } from "../selectors/auth.selectors";
import { accountDetailsUrl, UserUrl, resetPassword } from './URLs';
import { forkJoin, of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LogoutEnd } from "../actions/auth.actions";

@Injectable()
export class SettingEffects{
    private jwtToken: string;

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private toastr: ToastrService,
        private router: Router
    ) {}

    // this is for loading/getting the account details.
    @Effect()
    loadAccountDetails = this.actions$.pipe(
        ofType<SettingActions.LoadAccountStarts>(SettingActions.SettingActions.LoadAccountStarts),
        switchMap(() => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }

            return this.http.get(accountDetailsUrl, option).pipe(
                map((response: any) => {
                    const accountData = new SettingActions.AccountResponse(
                        response.firstName,
                        response.lastName,
                        response.centerId,
                        response.role,
                        response.phone,
                        response.userId,
                        response.email,
                        response.status
                    );
                    return new SettingActions.LoadAccountFinished(accountData);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: SettingActions.SettingActions.SettingActionFailed,
                    });
                })
            );
        })
    );

    // this is for updating the account details.
    @Effect()
    updateAccountDetails = this.actions$.pipe(
        ofType<SettingActions.UpdateSettingStarts>(SettingActions.SettingActions.UpdateSettingStarts),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            switch(request.payload.requestActionType){
                case "name":
                    {
                        return this.http.patch(UserUrl + `${request.payload.userId}`, request.payload.requestBody, option).pipe(
                            map((response: any) => {
                                this.toastr.success("Update user details",'Success');
                                return new SettingActions.LoadAccountStarts();
                            }),
                            catchError((error: HttpErrorResponse) => {
                                if(error.error["errorCode"] == 401){
                                    this.router.navigateByUrl('/auth');
                                    return of(new LogoutEnd());
                                }
                                let errorMessage = error.error['message'];
                                this.toastr.error(errorMessage,'Failed!');
                                return of(new SettingActions.LoadAccountStarts());
                            })
                        );
                        break;
                    }
                case  "password":
                    {
                        return this.http.patch(resetPassword, request.payload.requestBody, option).pipe(                    
                            map((response: any) => {
                                this.toastr.success("Reset Password",'Success');
                                return new SettingActions.LoadAccountStarts();
                            }),
                            catchError((error: HttpErrorResponse) => {
                                if(error.error["errorCode"] == 401){
                                    this.router.navigateByUrl('/auth');
                                    return of(new LogoutEnd());
                                }
                                let errorMessage = error.error['message'];
                                this.toastr.error(errorMessage,'Failed!');
                                return of(new SettingActions.LoadAccountStarts());
                            })
                        );
                        break;
                    }  
                default:
                    break;     
            }
        })
    );

}