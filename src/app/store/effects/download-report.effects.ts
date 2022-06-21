import * as downloadAction from './../actions/download-report.actions';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Store, select } from "@ngrx/store";
import { AppState } from "..";
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { userJwtToken } from '../selectors/auth.selectors';
import { PartnerUrl, DownloadReportUrl, trainingCenterwithPartnerId, DownloadAttachmentUrl} from './URLs';
import { ITrainingCenter } from "../../util/trainingCenterDataUtil"
import { Observable, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { Router } from '@angular/router';
import { LogoutEnd } from '../actions/auth.actions';

const MIME_TYPE = {
    pdf: 'application/pdf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip'
}

@Injectable()
export class DownloadReportEffects {
    jwtToken: string;
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private toastr: ToastrService,
        private loadingSpinner: LoadingSpinnerService,
        private router: Router
    ) {}

    // to get the list of training center based on given partnerId.
    getTraingCenter(partnerId: string): Observable<any>{
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });
        const option = {
            headers: {
                jwtToken: this.jwtToken
            }
        }
        return this.http.get(trainingCenterwithPartnerId +partnerId+ "/trainingCenter", option);
    }

    // to download the partner report with the given of partnerId and projectId.
    @Effect()
    downloadPartnerReportStart = this.actions$.pipe(
        ofType<downloadAction.DownloadPartnerReportStart>(downloadAction.DownloadReportActions.DownloadPartnerReportStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    partnerId: request.payload.partnerId,
                    projectId: request.payload.projectId,
                    'Content-Type': 'application/json'
                },

                params: {
                    reportType: request.payload.reportType
                },

                observe: "response" as "response",
                responseType: 'blob' as 'blob'
            }
            
            return this.http.get(DownloadReportUrl, option).pipe(
                tap((data) => {
                    let contentDisposition = data.headers.get('content-disposition');
                    const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
                    this.loadingSpinner.isLoading.next(false);
                    saveAs(new Blob([data.body], {type: MIME_TYPE[EXT]}), fileName);
                }), 
                map((response) => {                 
                    return new downloadAction.DownloadReportFinished("success");
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error("Mapping is not found", 'Failed!');
                    return of({
                        type: downloadAction.DownloadReportActions.DownloadReportFinished,
                        payload: { errorMessage }
                    });
                })
            );
        })
    );

    // to download the project report with the given of projectId.
    @Effect()
    downloadProjectReportStart = this.actions$.pipe(
        ofType<downloadAction.DownloadProjectReportStart>(downloadAction.DownloadReportActions.DownloadProjectReportStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    projectId: request.payload.projectId,
                    'Content-Type': 'application/json',                
                },

                params: {
                    reportType: request.payload.reportType
                },

                observe: "response" as "response",
                responseType: 'blob' as 'arraybuffer'
            }
            return this.http.get(DownloadReportUrl, option).pipe(
                tap((data) => {                   
                    let contentDisposition = data.headers.get('content-disposition');
                    const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
                    this.loadingSpinner.isLoading.next(false);
                    saveAs(new Blob([data.body], {type: MIME_TYPE[EXT]}), fileName);
                }), 
                map((response) => {                 
                    return new downloadAction.DownloadReportFinished("success");
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error("Mapping is not found", 'Failed!');
                    return of({
                        type: downloadAction.DownloadReportActions.DownloadReportFinished,
                        payload: { errorMessage }
                    });
                })
            );
        })
    );

    // to download the training center report with the given partnerId, projectId and tcId.
    @Effect()
    downloadTrainingCenterReportStart = this.actions$.pipe(
        ofType<downloadAction.DownloadTrainingCenterReportStart>(downloadAction.DownloadReportActions.DownloadTrainingCenterReportStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    tcId: request.payload.tcId,
                    partnerId: request.payload.partnerId,
                    projectId: request.payload.projectId,
                    'Content-Type': 'application/json'
                },

                params: {
                    reportType: request.payload.reportType
                },

                observe: "response" as "response",
                responseType: 'blob' as 'blob'
            }

            return this.http.get(DownloadReportUrl, option).pipe(
                tap((data) => {
                    let contentDisposition = data.headers.get('content-disposition');
                    const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
                    this.loadingSpinner.isLoading.next(false);
                    saveAs(new Blob([data.body], {type: MIME_TYPE[EXT]}), fileName);
                }), 
                map((response) => {                 
                    return new downloadAction.DownloadReportFinished("success");
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error("Mapping is not found", 'Failed!');
                    return of({
                        type: downloadAction.DownloadReportActions.DownloadReportFinished,
                        payload: { errorMessage }
                    });
                })
            );
        })
    );


    // to download the training center attachment with the given partnerId, projectId and tcId.
    @Effect()
    downloadTCAttachmentStart = this.actions$.pipe(
        ofType<downloadAction.DownloadAttachmentStart>(downloadAction.DownloadReportActions.DownloadAttachmentStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    tcId: request.payload.tcId,
                    partnerId: request.payload.partnerId,
                    projectId: request.payload.projectId,
                    'Content-Type': 'application/json',
                },

                params: {
                    reportType: request.payload.reportType
                },

                observe: "response" as "response",
                responseType: 'blob' as 'blob'
            }

            return this.http.get(DownloadAttachmentUrl, option).pipe(
                tap((data) => {
                    let contentDisposition = data.headers.get('content-disposition');
                    const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
                    this.loadingSpinner.isLoading.next(false);
                    saveAs(new Blob([data.body], {type: MIME_TYPE[EXT]}), fileName);
                }), 
                map((response) => {                 
                    return new downloadAction.DownloadReportFinished("success");
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error("Unable to get Attachements", 'Failed!');
                    return of({
                        type: downloadAction.DownloadReportActions.DownloadReportFinished,
                        payload: { errorMessage }
                    });
                })
            );
        })
    );
}