import { AppState } from '..';
import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { userJwtToken } from '../selectors/auth.selectors';
import { select, Store } from "@ngrx/store";
import { switchMap, tap, map, catchError } from "rxjs/operators";
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { ViewReportUrl } from "./URLs";
import * as ReportAction from '../actions/report.actions';
import { IPartnerReport } from 'src/app/util/partnerReportDataUtil';
import { IProjectReport } from 'src/app/util/projectReportDataUtil';
import { ITrainingCenterReport } from 'src/app/util/trainingCenterReportDataUtil';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LogoutEnd } from '../actions/auth.actions';

@Injectable()
export class ReportEffects{
    jwtToken: string;

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private toastr: ToastrService,
        private loadingSpinner: LoadingSpinnerService,
        private router: Router
    ) {}

    // to get the partner report with the given of partnerId and projectId.
    @Effect()
    loadPartnerReport = this.actions$.pipe(
        ofType<ReportAction.FetchPartnerReportStart>(ReportAction.ReportActions.FetchPartnerReportStart),
        switchMap((data) =>{
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    partnerId: data.payload.partnerId,
                    projectId: data.payload.projectId
                },

                params: {
                    reportType: data.payload.reportType
                }
            }

            return this.http.get(ViewReportUrl, option).pipe(
                map((response: IPartnerReport) => {
                    this.loadingSpinner.isLoading.next(false);
                    console.log("load partner report: ", response);
                    if(response["warning"]){
                        this.toastr.warning(response["warning"], "Warning.");
                    }
                    return new ReportAction.FetchPartnerReportEnd(response);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage ,"Failed!");
                    return of(new ReportAction.ReportActionFails());
                })
            );
        })
    );

    // to get the project report with the given of projectId.
    @Effect()
    loadProjectReport = this.actions$.pipe(
        ofType<ReportAction.FetchProjectReportStart>(ReportAction.ReportActions.FetchProjectReportStart),
        switchMap((data) =>{
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    projectId: data.payload.projectId
                },

                params: {
                    reportType: data.payload.reportType
                }
            }

            return this.http.get(ViewReportUrl, option).pipe(
                map((response: IProjectReport) => {
                    this.loadingSpinner.isLoading.next(false);
                    if(response["warning"]){
                        this.toastr.warning(response["warning"], "Warning.");
                    }
                    return new ReportAction.FetchProjectReportEnd(response);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,"Failed!");
                    return of(new ReportAction.ReportActionFails());
                })
            );
        })
    );

    // to get the training center report with the given partnerId, projectId and tcId.
    @Effect()
    loadTrainingCenterReport = this.actions$.pipe(
        ofType<ReportAction.FetchTrainingCenterReportStart>(ReportAction.ReportActions.FetchTrainingCenterReportStart),
        switchMap((data) =>{
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    tcId: data.payload.tcId,
                    partnerId: data.payload.partnerId,
                    projectId: data.payload.projectId
                },

                params: {
                    reportType: data.payload.reportType
                }
            }

            return this.http.get(ViewReportUrl, option).pipe(
                // tap((data) => {
                // }),
                map((response: ITrainingCenterReport) => {
                    this.loadingSpinner.isLoading.next(false);
                    if(response["warning"]){
                        this.toastr.warning(response["warning"], "Warning.");
                    }
                    return new ReportAction.FetchTrainingCenterReportEnd(response);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,"Failed!");
                    return of(new ReportAction.ReportActionFails());
                })
            );
        })
    );
}