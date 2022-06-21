import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { select, Store } from "@ngrx/store";
import { AppState } from "../index";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { CreateSurveyEnd, CreateSurveyStart, FetchSurveyEnd, FetchSurveyStart, SurveyActions } from "../actions/survey.actions";
import { SurveyBaseUrl } from "./URLs";
import { userJwtToken } from '../selectors/auth.selectors';
import { Section } from 'src/app/util/FormType';
import { formsArraySelector } from '../selectors/form.selectors';
import { of } from "rxjs";
import { LogoutEnd } from "../actions/auth.actions";
import { getAllProjects, getSelectedProject } from "../selectors/projects.selectors";
import { CreateSurveyUtilityService } from "src/app/services/create-survey/create-survey-utility.service";
import { FormArray } from "@angular/forms";
import { Toast, ToastrService } from "ngx-toastr";

export interface IndividualSurveyType {
  surveyId: string,
  formName: string,
  surveyData: {
    sections: Section[]
  },
  time: {
    $numberLong: "1601550140641"
  },
  maxScore: number
}
export interface FetchAllSurveyResponsePayloadType {
  survey: IndividualSurveyType
}

@Injectable()
export class SurveyEffects {
  jwtToken: string;

  // to get the servey data to preview it.
  @Effect()
  fetchSurvey = this.actions$.pipe(
    ofType<FetchSurveyStart>(SurveyActions.FetchSurveyStart),
    switchMap(surveyId => {
      this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
        this.jwtToken = jwtToken;
      });
      
      const option = {
        headers: {
          jwtToken: this.jwtToken
        }
      }
      return this.http.get(SurveyBaseUrl+`${surveyId.surveyId}`, option)
        .pipe(
          tap(response => {
            let index:number;
            this.store.pipe(select(formsArraySelector)).subscribe(formArray=>{
             index= formArray.findIndex(val=>{
                  return val._surveyId==surveyId.surveyId
              })
            })
            if(surveyId.preview){
              this.router.navigate([`manage-rating-forms/preview-project-wizard/${index}`])
            }else{
              this.router.navigate([`/manage-rating-forms/create/${index}`])
            }
          }),
          map((response: FetchAllSurveyResponsePayloadType) => {
            return new FetchSurveyEnd(response)
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.error["errorCode"] == 401){
                this.router.navigateByUrl('/auth');
                return of(new LogoutEnd());
            }
            return of({
                type: SurveyActions.SurvayActionFailed
            });
          })
        )
    })
  )

  // to update the survey data.
  @Effect()
  updateSurvey = this.actions$.pipe(
    ofType<CreateSurveyStart>(SurveyActions.CreateSurveyStart),
    switchMap((createSurveyStart) => {
      this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
        this.jwtToken = jwtToken;
      });
      const option = {
        headers: {
          jwtToken: this.jwtToken
        }
      }

      return this.http.patch(
        SurveyBaseUrl + createSurveyStart.payload.surveyId,
        createSurveyStart.payload.surveyData,
        option
      ).pipe(
        tap(response => {
        }),
        map(() => {
          let index;
    let selectedProject
    
    this.store.pipe(select(getSelectedProject)).subscribe(project=>{
      selectedProject=project
    })
    this.store.pipe(select(getAllProjects)).subscribe(res=>{
      index=res.findIndex(project=>{
        return selectedProject==project.projectId
      })
    });
    
    (this.util.surveyForm.get('surveyData') as FormArray).clear()
    

    this.router.navigate([`/manage-rating-forms/form/${index}`]);
          return new CreateSurveyEnd()
        }),
        catchError((error: HttpErrorResponse) => {
          if(error.error["errorCode"] == 401){
              this.router.navigateByUrl('/auth');
              return of(new LogoutEnd());
          }else{
            this.toaster.error(error.error.message)
            return of({
                type: SurveyActions.SurvayActionFailed
            });
          }
        })
      )
    })
  )

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    public util: CreateSurveyUtilityService,
    private toaster:ToastrService
  ) {
  }
}
