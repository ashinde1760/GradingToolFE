import { AppState } from '..';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateFormEnd, CreateFormStart, DeleteFormStart, FormActions, FormFetchEnd, FormFetchStart, PublishFormStart, SelectForm, UpdateFormEnd, UpdateFormStart } from '../actions/form.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { userJwtToken } from '../selectors/auth.selectors';
import { FormURL,FetchFormsURL} from './URLs';
import { FormModel } from '../models/form.model';
import { getAllProjects, getSelectedProject } from '../selectors/projects.selectors';
import { ToastrService } from 'ngx-toastr';
import { formsArraySelector } from '../selectors/form.selectors';
import { CreateSurveyUtilityService } from 'src/app/services/create-survey/create-survey-utility.service';
import { of } from 'rxjs';
import { LogoutEnd } from '../actions/auth.actions';

@Injectable()
export class FormEffects {

    jwtToken: string;
    formId:string;

    constructor(
        private http: HttpClient,
        private store: Store<AppState>,
        private actions$: Actions,
        private router: Router,
        private toast:ToastrService,
        private util:CreateSurveyUtilityService,
        private route:ActivatedRoute
    ) {
    }

    // fetch the forms with its details
    @Effect()
    fetchForm=this.actions$.pipe(
        ofType<FormFetchStart>(FormActions.FormFetchStart),
        switchMap((request)=>{
            let projectId:string;
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            this.store.pipe(select(getAllProjects)).subscribe(
                projects => {        
                    if(projects){
                        projectId=projects[+request.payload].projectId;
                    }else{
                        this.router.navigate(['manage-rating-forms/edit-project-wizard']);
                    }
                }
              )
             return this.http.get<{responseData:{formName:string,userRolesAllowed:string[],projectId:string,formId:string,surveyId:string,timeOfCreate:string, isPublish: boolean}[]}>(FetchFormsURL+`${projectId}/form`,{
                  headers:{
                    jwtToken: this.jwtToken
                  }
              }).pipe(
                map((response) => {
                   let array= response.responseData.map(formObject=>{
                        return {  
                                 _formName: formObject.formName,
                                 _userRole: formObject.userRolesAllowed,
                                 _projectId: formObject.projectId,
                                 _formId: formObject.formId,
                                 _surveyId: formObject.surveyId ,
                                 _timeOfCreate: formObject.timeOfCreate,
                                 _isPublish: formObject.isPublish                               
                               }
                    })
                    return new FormFetchEnd(array)
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: FormActions.FormActionFailed
                    });
                })
              )
        })
    )

    // create new form
    @Effect()
    createForm = this.actions$.pipe(
        ofType<CreateFormStart>(FormActions.CreateFormStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const requestPayload = request.payload;
            let projectId:string;
            
            this.store.pipe(select(getSelectedProject)).subscribe(value=>projectId=value)
            return this.http.post(FormURL,
                {
                    "projectId": projectId,
                     "formName": requestPayload._formName,
                    "userRolesAllowed": [...requestPayload._userRole]
                }, {
                headers: {
                    jwtToken: this.jwtToken
                }
            }).pipe(
                map((response) => {
                      
                    this.router.navigate([`/manage-rating-forms/create`]);
                    return new CreateFormEnd(
                        new FormModel(
                               request.payload._formName,
                               request.payload._userRole,
                               null,
                               projectId,
                               response['formId'],
                               response['surveyId'],
                               request.payload._timeOfCreate
                        ));
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: FormActions.FormActionFailed
                    });
                })
            );
        })
    );

    // update the form details
    @Effect()
    updateForm = this.actions$.pipe(
        ofType<UpdateFormStart>(FormActions.UpdateFormStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const requestPayload = request.payload;
            let projectId:string;
            
            this.store.pipe(select(getSelectedProject)).subscribe(value=>projectId=value)

                this.formId=requestPayload._formId
            return this.http.patch(FormURL+'/'+this.formId,
                {
                    "projectId": projectId,
                     "formName": requestPayload._formName,
                    "userRolesAllowed": [...requestPayload._userRole]
                }, {
                headers: {
                    jwtToken: this.jwtToken
                }
            }).pipe(
                map((response) => {
                    let updatedArray:FormModel[];
                    this.toast.success("Update Successful")
                    this.store.pipe(select(formsArraySelector)).subscribe((formArray:FormModel[])=>{
                      updatedArray=  formArray.map(element=>{
                         if(element._formId==this.formId){
                             return {
                                 ...element,
                                 ...request.payload
                             }
                         }else{
                             return element
                         }
                        })
                    })
                    return new UpdateFormEnd(updatedArray,requestPayload._formName );
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: FormActions.FormActionFailed
                    });
                })
            );
        })
    );
    
    
    // delete the form
    @Effect()
    deleteForm = this.actions$.pipe( ofType<DeleteFormStart>(FormActions.DeleteFormStart),
    switchMap((request) => {
        this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
            this.jwtToken = jwtToken;
        });
         this.formId = request.payload;
      
        return this.http.delete(FormURL+'/'+this.formId,
            {
            headers: {
                jwtToken: this.jwtToken
            }
        }).pipe(
            map((response) => {
                let newArray:FormModel[];
                this.toast.success("Delete Successful")
                this.store.pipe(select(formsArraySelector)).subscribe((formArray:FormModel[])=>{
                  newArray=  formArray.filter(element=>{
                     return element._formId!==this.formId
                    });
                });
                return new UpdateFormEnd(newArray );
            }),
            catchError((error: HttpErrorResponse) => {
                if(error.error["errorCode"] == 401){
                    this.router.navigateByUrl('/auth');
                    return of(new LogoutEnd());
                }
                return of({
                    type: FormActions.FormActionFailed
                });
            })
        );
    }));

    // publish the form
    @Effect()
    publishForm = this.actions$.pipe(
        ofType<PublishFormStart>(FormActions.PublishFormStart),
        switchMap((request) => {
            this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
                this.jwtToken = jwtToken;
            });
            const option = {
                headers: {
                    jwtToken: this.jwtToken
                }
            };
            return this.http.post(FormURL+"/publish/"+`${request.payload.formId}`, {"status":true}, option).pipe(
                map((response) => {
                    return new FormFetchStart(request.payload.id);
                }),
                catchError((error: HttpErrorResponse) => {
                    if(error.error["errorCode"] == 401){
                        this.router.navigateByUrl('/auth');
                        return of(new LogoutEnd());
                    }
                    return of({
                        type: FormActions.FormActionFailed
                    });
                })
            );
        })
    );
}
