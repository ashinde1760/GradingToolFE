import { AddIndividualStart, MasterDataActions, AddIndividualEnd,  PartnerPayloadType, DeleteStart, DownloadTemplateStart, DownloadTemplateEnd, UploadDataFails, FailedUploadData, AddMultipleEnds} from './../actions/master-data.action';
import { DeleteEnds, FilterStarts, FilterEnds, UpdateIndividualStart, UpdateIndividualEnd, ListMasterDataStarts, ListMasterDataFinished, AddMultipleStarts  }from './../actions/master-data.action';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { AppState } from '..';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { userJwtToken } from '../selectors/auth.selectors';
import { MasterDataUrl, downloadTemplateUrl } from './URLs';
import { of } from 'rxjs';
import { Patner } from '../models/patner.model';
import { Md5 } from 'ts-md5/dist/md5'
import { ToastrService } from 'ngx-toastr';
import { ListofCenterInchargeStart, ListofClientSponsorStart, ListPartnerStarts } from '../actions/patner.actions';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { LogoutEnd } from '../actions/auth.actions';
import { getLoadingProcessState} from '../selectors/master-data.selectors';

const MIME_TYPE = {
    pdf: 'application/pdf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export interface FetchAllPartners {
    projectMasterData: ProjectMasterData;
}

export class ProjectMasterData {
projectMappingId: string;
    projectDetails: Project;
    partnerDetails: Partner;
}

export interface Partner {
    partnerName: string,
    contact: string,
    headPerson: string, 
    traningCentersDetails: TrainingCenterDetail
}

export interface TrainingCenterDetail {
    tcId: string,
    tcName: string,
    centerAddress: string,
    district: string,
    centerInchargeId: string,
    latitude: string,
    longitude: string
}

export class Project {
    projectName: string;
    projectId: string;
}

@Injectable()
export class MasterDataEffects {
    jwtToken: string;
    id: string[] = [];
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private toastr: ToastrService,
        private router: Router,
        private loadingSpinner: LoadingSpinnerService
    ) {}

    // add single master data manually.
    @Effect()
    addIndividualStart = this.actions$.pipe(
        ofType<AddIndividualStart>(MasterDataActions.AddIndividualStart),
        switchMap((masterData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }

            return this.http.post(MasterDataUrl, masterData.payload, option).pipe(
                tap((data) => {
                    this.loadingSpinner.isLoading.next(false);
                }),
                map((response) => {
                    this.toastr.success(response['msg'],'Success');
                    this.store.dispatch(new ListMasterDataStarts());
                //    this.store.dispatch(new ListPartnerStarts());
                //    this.store.dispatch(new ListofClientSponsorStart())
                //    this.store.dispatch(new ListofCenterInchargeStart())
                    return new AddIndividualEnd({success:response['msg']});
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,'Failed!');
                    this.store.dispatch(new ListMasterDataStarts());
                    return of({
                        type: MasterDataActions.AddIndividualFails,
                        payload: {errorMessage }
                    });
                })
            );
        })
    );

    // get the master data list.
    @Effect()
    listMasterStart = this.actions$.pipe(
        ofType<ListMasterDataStarts>(MasterDataActions.ListMasterDataStarts),
        switchMap(() => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.get(MasterDataUrl, option).pipe(
                tap((data) => {
                    this.store.select(getLoadingProcessState).subscribe((status) =>{
                        if(!status){
                            this.loadingSpinner.isLoading.next(false);
                        }
                    })
                }), 
                map((response) => {
                  let temp = [];
                    if (response['projectMasterData'] && response['projectMasterData'].length > 0) {
                       temp = response['projectMasterData'].map((element:{"isGradingEnable":boolean,"partnerDetails":{"clientSponsorContact":string,"clientSponsorEmail":string,"clientSponsorFirstName":string,"traningCentersDetails":{"centerInchargeLastName":string,"centerInchargeFirstName":string,"district":string,"latitude":string,"centerInchargeContact":string,"centerInchargeEmail":string,"tcName":string,"tcId":string,"centerAddress":string,"centerInchargeId":string,"longitude":string},"partnerName":string,"clientSponsorId":string,"partnerId":string,"clientSponsorLastName":string},"partnerProjectId":string,"projectMappingId":string,"projectDetails":{"projectName":string,"projectId":string}})=>{
                            return {
                                "projectDetails": {
                                    "projectId": element.projectDetails.projectId,
                                    "projectName": element.projectDetails.projectName,
                                },
                                projectMappingId:element.projectMappingId,
                                "partnerId":element.partnerDetails.partnerId,
                                "partnerDetails": {
                                    'isGradingEnable':element.isGradingEnable,
                                    "partnerProjectId":element.partnerProjectId,
                                    "partnerName": element.partnerDetails.partnerName,
                                    "clientSponsor": {
                                        "firstName": element.partnerDetails.clientSponsorFirstName,
                                        "lastName": element.partnerDetails.clientSponsorLastName,
                                        "phone": element.partnerDetails.clientSponsorContact,
                                        "email": element.partnerDetails.clientSponsorEmail
                                    }
                                    ,
                                    "clientSponsorId":element.partnerDetails.clientSponsorId,
                                    "traningCentersDetails": {
                                        "tcId": element.partnerDetails.traningCentersDetails.tcId,
                                        "tcName":element.partnerDetails.traningCentersDetails.tcName,
                                        "district":element.partnerDetails.traningCentersDetails.district,
                                        "latitude":element.partnerDetails.traningCentersDetails.latitude,
                                        "centerAddress":element.partnerDetails.traningCentersDetails.centerAddress,
                                        "longitude": element.partnerDetails.traningCentersDetails.longitude,
                                        "centerInCharge": {
                                            "firstName": element.partnerDetails.traningCentersDetails.centerInchargeFirstName,
                                            "lastName":element.partnerDetails.traningCentersDetails.centerInchargeLastName,
                                            "phone": element.partnerDetails.traningCentersDetails.centerInchargeContact,
                                            "email": element.partnerDetails.traningCentersDetails.centerInchargeEmail,
                                        },
                                        'centerInchargeId':element.partnerDetails.traningCentersDetails.centerInchargeId
                                    }
                                }                            
                            }
                        })
                    };
                    return new ListMasterDataFinished(temp);
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
                        type: MasterDataActions.MasterActionFails
                    });
                })
            );
        })
    );

    // delete master data
    @Effect()
    deleteDataStart = this.actions$.pipe(
        ofType<DeleteStart>(MasterDataActions.DeleteStarts),
        tap(() => { }),
        switchMap((masterData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            };

            const reqBody = {
                "projectMappingIds": masterData.payload
            }

            return this.http
                .post(MasterDataUrl + '/deleteMultipleMapping',reqBody, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response) => {
                        let successCount = response['success'].length;
                        let failureCount = response['failure'].length;
                        let deletedEntries = [];
                        for (var success of response['success']) { 
                            deletedEntries.push(success.projectMappingId);
                        }
                        this.toastr.success(successCount +' : Delete Successful \n'+ failureCount +'Fails','Success');
                        return new DeleteEnds({deleteEntries: deletedEntries,success:response['msg']});
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
                            type: MasterDataActions.DeleteFails,
                            payload: { errorMessage }
                        });
                    })
                );
        })
    );

    // to filter master data by given partner name or project name or training center.
    @Effect()
    filetrMasterData = this.actions$.pipe(
        ofType<FilterStarts>(MasterDataActions.FilterStarts),
        switchMap((masterData) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            let ptrName = masterData.payload.partnerName;
            let proName = masterData.payload.projectName;
            let tcId =  masterData.payload.tcId;
            let queryParam;
            if ((ptrName !== "" && ptrName !== null && typeof ptrName !=="undefined") 
                && (proName !== "" && proName !==  null && typeof proName !== "undefined") 
                && (tcId !== "" && tcId !== null && typeof tcId !== "undefined"))
                queryParam = "partnerName=" + ptrName + "&projectName=" + proName + "&tcId=" + tcId;

            else if ((ptrName !== "" && ptrName !== null && typeof ptrName !=="undefined") 
                     && (proName !== "" && proName !==  null && typeof proName !== "undefined"))
                     queryParam = "partnerName=" + ptrName + "&projectName=" + proName;

            else if ((ptrName !== "" && ptrName !== null && typeof ptrName !=="undefined") 
                     && (tcId !== "" && tcId !== null && typeof tcId !== "undefined"))
                     queryParam = "partnerName=" + ptrName + "&tcId=" + tcId;

            else if ((proName !== "" && proName !==  null && typeof proName !== "undefined") 
                     && (tcId !== "" && tcId !== null && typeof tcId !== "undefined"))
                     queryParam = "projectName=" + proName + "&tcId=" + tcId;

            else if (ptrName !== "" && ptrName !== null && typeof ptrName !=="undefined")
                     queryParam = "partnerName=" +ptrName;

            else if (proName !== "" && proName !==  null && typeof proName !== "undefined")
                     queryParam = "projectName=" + proName;

            else if (tcId !== "" && tcId !== null && typeof tcId !== "undefined") 
                     queryParam = "tcId=" +tcId;
                     else
                     queryParam = "";

            return this.http.get(MasterDataUrl + "/filter?"+queryParam, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response) => {
                        let temp = [];
                        if (response['projectMasterData'] && response['projectMasterData'].length >0) {
                            temp = response['projectMasterData'].map((element:{"isGradingEnable":boolean,"partnerDetails":{"clientSponsorContact":string,"clientSponsorEmail":string,"clientSponsorFirstName":string,"traningCentersDetails":{"centerInchargeLastName":string,"centerInchargeFirstName":string,"district":string,"latitude":string,"centerInchargeContact":string,"centerInchargeEmail":string,"tcName":string,"tcId":string,"centerAddress":string,"centerInchargeId":string,"longitude":string},"partnerName":string,"clientSponsorId":string,"partnerId":string,"clientSponsorLastName":string},"partnerProjectId":string,"projectMappingId":string,"projectDetails":{"projectName":string,"projectId":string}})=>{
                                return {
                                    "projectDetails": {
                                        "projectId": element.projectDetails.projectId,
                                        "projectName": element.projectDetails.projectName,
                                    },
                                    projectMappingId:element.projectMappingId,
                                    "partnerId":element.partnerDetails.partnerId,
                                    "partnerDetails": {
                                        'isGradingEnable':element.isGradingEnable,
                                        "partnerProjectId":element.partnerProjectId,
                                        "partnerName": element.partnerDetails.partnerName,
                                        "clientSponsor": {
                                            "firstName": element.partnerDetails.clientSponsorFirstName,
                                            "lastName": element.partnerDetails.clientSponsorLastName,
                                            "phone": element.partnerDetails.clientSponsorContact,
                                            "email": element.partnerDetails.clientSponsorEmail
                                        }
                                        ,
                                        "clientSponsorId":element.partnerDetails.clientSponsorId,
                                        "traningCentersDetails": {
                                            "tcId": element.partnerDetails.traningCentersDetails.tcId,
                                            "tcName":element.partnerDetails.traningCentersDetails.tcName,
                                            "district":element.partnerDetails.traningCentersDetails.district,
                                            "latitude":element.partnerDetails.traningCentersDetails.latitude,
                                            "centerAddress":element.partnerDetails.traningCentersDetails.centerAddress,
                                            "longitude": element.partnerDetails.traningCentersDetails.longitude,
                                            "centerInCharge": {
                                                "firstName": element.partnerDetails.traningCentersDetails.centerInchargeFirstName,
                                                "lastName":element.partnerDetails.traningCentersDetails.centerInchargeLastName,
                                                "phone": element.partnerDetails.traningCentersDetails.centerInchargeContact,
                                                "email": element.partnerDetails.traningCentersDetails.centerInchargeEmail,
                                            },
                                            'centerInchargeId':element.partnerDetails.traningCentersDetails.centerInchargeId
                                        }
                                    }
                                
                            }
                            })
                        }
                        return new FilterEnds(temp);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage,"Failed!");
                        return of({
                            type: MasterDataActions.MasterActionFails
                        });
                    })
                );
        })
    );

    // to update the master data details
    @Effect()
    updateIndividualStart = this.actions$.pipe(
        ofType<UpdateIndividualStart>(MasterDataActions.UpdateIndividualStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }
            return this.http.patch(MasterDataUrl+"/" + request.payload.projectMappingId, request.payload.masterData, option).pipe(
                tap((data) => {
                    this.loadingSpinner.isLoading.next(false);
                }),
                map((response) => {
                    this.toastr.success(response['msg'],"Success")
                    this.store.dispatch(new ListMasterDataStarts())
                    // this.store.dispatch(new ListPartnerStarts());
                    // this.store.dispatch(new ListofClientSponsorStart());
                    // this.store.dispatch(new ListofCenterInchargeStart());
                    return new UpdateIndividualEnd({success:response['msg']});
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.loadingSpinner.isLoading.next(false);
                    this.toastr.error(errorMessage,"Failed!");
                    this.store.dispatch(new ListMasterDataStarts());
                    return of({
                        type: MasterDataActions.updateFailed,
                        payload: {errorMessage }
                    });
                })
            );
        })
    );


    // To add multiple master data by uploading the data list file.
    @Effect()
    addMultipleData = this.actions$.pipe(
        ofType<AddMultipleStarts>(MasterDataActions.AddMultipleStarts),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken,
                    projectId:request.payload.projectId
                }
            }
             
            return this.http.post(MasterDataUrl + "/upload", request.payload.data, option)
                .pipe(
                    tap((data) => {
                        this.loadingSpinner.isLoading.next(false);
                    }),
                    map((response: FailedUploadData) => {
                        this.store.dispatch(new ListPartnerStarts());
                        this.store.dispatch(new ListofClientSponsorStart());
                        this.store.dispatch(new ListofCenterInchargeStart());
                        if(response.totalRecord !== response.failuresRecordsCount){
                            this.toastr.success("Upload Successful",'Success');
                        }
                        if(response.failuresRecordsCount > 0){
                            this.store.dispatch(new AddMultipleEnds());
                            return new UploadDataFails({failedUploadData: response});
                        }
                        this.store.dispatch(new ListMasterDataStarts());
                        return new AddMultipleEnds();
                    }), catchError((error: HttpErrorResponse) => {
                        if(error.error["errorCode"] == 401){
                            this.router.navigateByUrl('/auth');
                            return of(new LogoutEnd());
                        }
                        let errorMessage = error.error['message'];
                        this.loadingSpinner.isLoading.next(false);
                        this.toastr.error(errorMessage,"Failed!");
                        return of({
                            type: MasterDataActions.AddMultipleFails,
                            payload: {errorMessage }
                        });
                    })
                );
        })
    );

    // to download the file template to add the data of master. 
    @Effect()
    downloadTemplate = this.actions$.pipe(
        ofType<DownloadTemplateStart>(MasterDataActions.DownloadTemplateStart),
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
                    this.toastr.success("download Successful",'Success');
                    saveAs(new Blob([response.body], {type: MIME_TYPE[EXT]}), fileName);
                    return new DownloadTemplateEnd();
                }), catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    let errorMessage = error.error['message'];
                    this.toastr.error(errorMessage,"Failed!");
                    return of({
                        type: MasterDataActions.DownloadTemplateEnd,
                    });
                })
            );
        })
    );

}