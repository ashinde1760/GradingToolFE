import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { AppState } from '../index';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  CreateProjectEnd,
  CreateProjectStart,
  DeleteProjectEnd,
  DeleteProjectStart,
  FetchProjectsEnd,
  FetchProjectsStart,
  ProjectActions,
  UpdateProjectEnd,
  UpdateProjectStart
} from '../actions/project.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { userJwtToken } from "../selectors/auth.selectors";
import { ProjectModel } from "../models/project.model";
import { Router } from "@angular/router";
import { getAllProjects } from "../selectors/projects.selectors";
import { ProjectBaseUrl } from "./URLs";
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { LogoutEnd } from '../actions/auth.actions';

export interface CreateProjectResponseType {
  msg: string,
  projectId: string,
  surveyId: string
}

export interface FetchAllProjectsResponseType {
  "projectId": string,
  "surveyId": string,
  "projectName": string,
  "projectDescription": string,
  "startDate": string
  "endDate": string,
  "selfAssignmentDeadLine": string
}

@Injectable()
export class ProjectEffects {

  jwtToken: string;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    private toastr: ToastrService,
    private loadingSpinner: LoadingSpinnerService
  ) {}


  // get the list of projects.
  @Effect()
  fetchAllProjects = this.actions$.pipe(
    ofType<FetchProjectsStart>(ProjectActions.FetchProjectsStart),
    switchMap(() => {

      this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
        this.jwtToken = jwtToken;
      });

      return this.http.get(
        ProjectBaseUrl,
        {
          headers: {
            jwtToken: this.jwtToken
          }
        }).pipe(
          map((projects: { projects: FetchAllProjectsResponseType[] }) => {
            const temp = [];
            projects.projects.forEach((project, index) => {
              temp.push(
                new ProjectModel(
                  project.projectId,
                  project.surveyId,
                  project.projectName,
                  project.projectDescription,
                  project.startDate,
                  project.endDate,
                  project.selfAssignmentDeadLine,
                  index === projects.projects.length - 1 ? true : false,
                )
              )
            });
            // this.router.navigate([`/home/project/${projects.projects.length - 1}`]);
            return new FetchProjectsEnd(temp);
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.error["errorCode"] == 401){
              this.router.navigateByUrl('/auth');
              return of(new LogoutEnd());
            }
            return of({
                type: ProjectActions.ProjectActionFails
             })
          })
        );
    })
  );

  // to create new project
  @Effect()
  createProject = this.actions$.pipe(
    ofType<CreateProjectStart>(ProjectActions.CreateProjectStart),
    switchMap((project) => {
      this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
        this.jwtToken = jwtToken;
      });
      const requestPayload = project.payload;

      return this.http.post<CreateProjectResponseType>(ProjectBaseUrl,
        requestPayload, {
        headers: {
          jwtToken: this.jwtToken
        }
      }).pipe(
        map((response) => {
          let projectArray:ProjectModel[];
          this.store.pipe(select(getAllProjects)).subscribe(
            projects => {
              projectArray=[...projects]
              projectArray.push( new ProjectModel(
                response.projectId,
                response.surveyId,
                project.payload.projectName,
                project.payload.projectDescription,
                project.payload.startDate,
                project.payload.endDate,
                project.payload.selfAssignmentDeadLine
                ))
            }
          ),
          // this.router.navigate([`/manage-rating-forms/create/`]);
          this.router.navigate([`/manage-rating-forms/form/${projectArray.length-1}`]);

          return new CreateProjectEnd(
           projectArray,response.projectId
          );
        
        }),
        catchError((error: HttpErrorResponse) => {
          if(error.error["errorCode"] == 401){
            this.router.navigateByUrl('/auth');
            return of(new LogoutEnd());
          }
          this.loadingSpinner.isLoading.next(false);
          let errorMessage = error.error['message'];
          this.toastr.error(errorMessage, "failed!");
          return of({
              type: ProjectActions.ProjectActionFails
           })
        })
      );
    })
  );


  // update project of given projectId
  @Effect()
  updateProjectById = this.actions$.pipe(
    ofType<UpdateProjectStart>(ProjectActions.UpdateProjectStart),
    switchMap((project) => {
      this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
        this.jwtToken = jwtToken;
      });

      const requestPayload = project.payload.projectData;

      return this.http.patch(
        ProjectBaseUrl + project.payload.projectId,
        requestPayload,
        {
          headers: {
            jwtToken: this.jwtToken
          }
        }).pipe(
          tap(response => {
            this.loadingSpinner.isLoading.next(false);
          }),
          map((projects: { survey }) => {
            let projectIndex;
            this.store.pipe(select(getAllProjects)).subscribe(
              projects => {
                projectIndex = projects.findIndex((product => product.projectId === project.payload.projectId))
              }
            )
            this.router.navigate([`manage-rating-forms/form/${projectIndex}`]);
            return new UpdateProjectEnd(project.payload);
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.error["errorCode"] == 401){
              this.router.navigateByUrl('/auth');
              return of(new LogoutEnd());
          }
            let errorMessage = error.error['message'];
            this.loadingSpinner.isLoading.next(false);
            this.toastr.error(errorMessage ,"Failed!");
            return of({
              type: ProjectActions.ProjectActionFails
            });
          })
      );
    })
  );

  // delete project.
  @Effect()
  deleteProject = this.actions$.pipe(
    ofType<DeleteProjectStart>(ProjectActions.DeleteProjectStart),
    switchMap((projectId) => {
      return this.http.delete(ProjectBaseUrl +projectId.payload,
        {
          headers: {
            jwtToken: this.jwtToken
          }
        }).pipe(
          tap(response => {
            this.loadingSpinner.isLoading.next(false);
          }),
          map(() => {
            const allProjects$ = this.store.pipe(select(getAllProjects))
            let length = 0;
            allProjects$.pipe(tap(projects => {
              length = projects.length
            }))
            this.router.navigateByUrl(`/home/project/${length - 1}`);
            return new DeleteProjectEnd(projectId.payload);
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.error["errorCode"] == 401){
              this.router.navigateByUrl('/auth');
              return of(new LogoutEnd());
          }
            let errorMessage = error.error['message'];
            this.loadingSpinner.isLoading.next(false);
            this.toastr.error(errorMessage ,"Failed!");
            return of({
              type: ProjectActions.ProjectActionFails
            });
          })
        )
    })
  )
}

