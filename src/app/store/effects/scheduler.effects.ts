import { ListSchedulerStarts, SchedulerActions, ListSchedulerFinished, FilterByStarts, FilterByEnds, Scheduler, UpdateSchedulerStarts, UpdateSchedulerEnds } from './../actions/scheduler.actions';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Store, select } from "@ngrx/store";
import { AppState } from "..";
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { userJwtToken } from '../selectors/auth.selectors';
import { SchedulerUrl, UserUrl } from './URLs';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { Router } from '@angular/router';
import { LogoutEnd } from '../actions/auth.actions';

@Injectable()
export class SchedulerEffects {
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

    // to get the field auditor list.
    getFieldAuditors(role: string): Observable<any>{
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });
        const option = {
            headers: {
                jwtToken: this.jwtToken
            },

            params: {
                role: role
            }
        }
        return this.http.get(UserUrl + "filter", option);
    }
    

    // to get the schedular data list.
    @Effect()
    loadSchedulerDetails = this.actions$.pipe(
        ofType<ListSchedulerStarts>(SchedulerActions.ListSchedulerStarts),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                },

                params: {
                    schedulerType: request.payload.schedulerType
                }
            }
            return this.http.get(SchedulerUrl, option).pipe(
                tap((data) => {
                    this.loadingSpinner.isLoading.next(false);
                }),
                map((response) => {
                    const temp = [];
                    response['Schedulers'].forEach(schedulerDetail => {
                        temp.push(new Scheduler(
                            schedulerDetail.selfAssignmentStatus,
                            schedulerDetail.partnerName,
                            schedulerDetail.fieldAuditorId,
                            schedulerDetail.isAuditCancel,
                            schedulerDetail.fieldAuditorName,
                            schedulerDetail.projectMappingId,
                            schedulerDetail.selfAssignmentDate,
                            schedulerDetail.tcName,
                            schedulerDetail.auditStatus,
                            schedulerDetail.partnerId,
                            schedulerDetail.tcId,
                            schedulerDetail.projectName,
                            schedulerDetail.projectId,
                            schedulerDetail.auditDate,
                            schedulerDetail.centerInchargeName,
                            schedulerDetail.formName,
                            schedulerDetail.clientSponsorName,
                            schedulerDetail.clientSponsorContact,
                            schedulerDetail.formId,
                            schedulerDetail.fieldAuditorContact
                        ))
                    });

                    return new ListSchedulerFinished(temp);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,'Failed!');
                    return of({
                        type: SchedulerActions.FailedSchedularAction,                     
                    });
                })
            );
        })
    );

    // to get the schedular data list after filtering it by given partner name or project name.
    @Effect()
    filetreData = this.actions$.pipe(
        ofType<FilterByStarts>(SchedulerActions.FilterByStarts),
        switchMap((masterData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken

                },
                params: {
                    schedulerType: masterData.payload.schedulerType
                }
            }
            let queryParam;

            if ((masterData.payload.partnerName && masterData.payload.partnerName !== "" && masterData.payload.partnerName !== typeof "undefined") && (masterData.payload.projectName && masterData.payload.projectName !== "" && masterData.payload.projectName !== typeof "undefined"))
                queryParam = "partnerName=" + masterData.payload.partnerName + "&projectName=" + masterData.payload.projectName;

            else if (masterData.payload.partnerName || masterData.payload.partnerName !== "" && masterData.payload.partnerName !== "undefined")
                queryParam = "partnerName=" + masterData.payload.partnerName;

            else if (masterData.payload.projectName && masterData.payload.projectName !== "" && masterData.payload.projectName !== "undefined")
                queryParam = "projectName=" + masterData.payload.projectName;

            return this.http.get(SchedulerUrl + "/filter?" + queryParam, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response) => {
                        const temp = [];
                        let selfAssessmentStatus = "NotCompleted";
                        response['Schedulers'].forEach(schedulerDetail => {
                            if (schedulerDetail.selfAssignmentStatus)
                                selfAssessmentStatus = "Completed"
                            else
                                selfAssessmentStatus = "Not Completed"
                        });
                        response['Schedulers'].forEach(schedulerDetail => {
                            temp.push(new Scheduler(
                                schedulerDetail.selfAssignmentStatus,
                                schedulerDetail.partnerName,
                                schedulerDetail.fieldAuditorId,
                                schedulerDetail.isAuditCancel,
                                schedulerDetail.fieldAuditorName,
                                schedulerDetail.projectMappingId,
                                schedulerDetail.selfAssignmentDate,
                                schedulerDetail.tcName,
                                schedulerDetail.auditStatus,
                                schedulerDetail.partnerId,
                                schedulerDetail.tcId,
                                schedulerDetail.projectName,
                                schedulerDetail.projectId,
                                schedulerDetail.auditDate,
                                schedulerDetail.centerInchargeName,
                                schedulerDetail.formName,
                                schedulerDetail.clientSponsorName,
                                schedulerDetail.clientSponsorContact,
                                schedulerDetail.formId,
                                schedulerDetail.fieldAuditorContact
                            ))

                        });
                        return new FilterByEnds(temp);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage,'Failed!');
                        return of({
                            type: SchedulerActions.ListSchedulerStarts,
                            payload: { schedulerType: masterData.payload.schedulerType}
                        });
                    })
                );
        })
    );

    // Update the schedular data
    @Effect()
    updateIndividualStart = this.actions$.pipe(
        ofType<UpdateSchedulerStarts>(SchedulerActions.UpdateSchedulerStarts),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                },

                params: {
                    schedulerType: request.payload.schedulerType
                }
            }
            return this.http.patch(SchedulerUrl, request.payload.reqBody, option).pipe(
                tap((data) => {
                    this.loadingSpinner.isLoading.next(false);
                }),
                map((response) => {
                    this.toastr.success('Schedular data updated','Success');
                    return new ListSchedulerStarts({schedulerType: request.payload.schedulerType});
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage =error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,'Failed!');
                    return of({
                        type: SchedulerActions.ListSchedulerStarts,
                        payload: {schedulerType: request.payload.schedulerType}
                    });
                })
            );
        })
    );
}