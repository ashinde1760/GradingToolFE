import { ListPartnerStarts, PartnerActions, PartnerWithTrainingCenters, ListPartnerFinished, TrainingCenterDetail, ListofClientSponsorStart, ListofClientSponsorEnd, ListofCenterInchargeStart, ListofCenterInchargeEnd, ListofTrainingCenterStart, ListofTrainingCenterEnd } from './../actions/patner.actions';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Store, select } from "@ngrx/store";
import { AppState } from "..";
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { userJwtToken } from '../selectors/auth.selectors';
import { clientSponserList, PartnerUrl,centerInchargeList, trainingCenterwithPartnerId } from './URLs';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogoutEnd } from '../actions/auth.actions';

@Injectable()
export class PartnerEffects {
    jwtToken: string;
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>,
        private router: Router
    ) {}

    // get the partners list
    @Effect()
    listPartnerStart = this.actions$.pipe(
        ofType<ListPartnerStarts>(PartnerActions.ListPartnerStarts),
        switchMap(() => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });

            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            }

            return this.http.get(PartnerUrl, option).pipe(
                map((response:{partners:[]}) => {
                    const temp = [];
                    if (response['partners'] && response['partners'].length >0) {               
                    }
                    return new ListPartnerFinished(response.partners);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: PartnerActions.clearPartnersData
                    });
                })
            );
        })
    );

    // get the client sponser list.
    @Effect()
    listofClientSponser=this.actions$.pipe(ofType<ListofClientSponsorStart>(PartnerActions.ListofClientSponserStart),
    switchMap(() => {
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });

        const option = {
            headers: {
                jwtToken: this.jwtToken
            }
        }

        return this.http.get(clientSponserList, option).pipe(
            map((response:{users:[]} )=> {             
                return new ListofClientSponsorEnd(response.users);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.error["errorCode"] == 401){
                    this.router.navigateByUrl('/auth');
                    return of(new LogoutEnd());
                }
                return of({
                    type: PartnerActions.clearPartnersData
                });
            })
        );
    }));

    // get the center-in-charge list.
    @Effect()
    listofCenterIncharge=this.actions$.pipe(ofType<ListofCenterInchargeStart>(PartnerActions.listofCenterInchargeStart),
    switchMap(() => {
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });

        const option = {
            headers: {
                jwtToken: this.jwtToken
            }
        }

        return this.http.get(centerInchargeList, option).pipe(
            map((response:{users:[]} )=> {
               
                return new ListofCenterInchargeEnd(response.users);
                }
            ),
            catchError((error: HttpErrorResponse) => {
                if(error.error["errorCode"] == 401){
                    this.router.navigateByUrl('/auth');
                    return of(new LogoutEnd());
                }
                return of({
                    type: PartnerActions.clearPartnersData
                });
            })
        );
    }))

    //get the list of training center
    @Effect()
    listofTrainingCenterWithPI=this.actions$.pipe(ofType<ListofTrainingCenterStart>(PartnerActions.listofTrainigCenterStart),
    switchMap((partnerId) => {
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });

        const option = {
            headers: {
                jwtToken: this.jwtToken
            }
        }

        return this.http.get(trainingCenterwithPartnerId+partnerId.payload+"/trainingCenter", option).pipe( 
            map((response:{traningCentersDetails:[]})=> {             
                return new ListofTrainingCenterEnd(response.traningCentersDetails);
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.error["errorCode"] == 401){
                    this.router.navigateByUrl('/auth');
                    return of(new LogoutEnd());
                }
                return of({
                    type: PartnerActions.clearPartnersData
                });
            })
        );
    }))
}