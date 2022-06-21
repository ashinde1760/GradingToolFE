import { LoginFail } from './../actions/auth.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthActions, LoginEnd, LoginStart, LogoutEnd, LogoutStart } from '../actions/auth.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from "../models/user.model";
import { ActiveProjectsManagementService } from "../../components/header/home/active-projects/services/active-projects-management.service";
import { Router } from "@angular/router";
import { AuthBaseUrl, VarifyUserByOtpUrl } from "./URLs";
import { of } from 'rxjs';
import { sha256 } from 'js-sha256';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private activeProjectsManagementService: ActiveProjectsManagementService,
    private router: Router,
    private loadingSpinner: LoadingSpinnerService,
    private toastr: ToastrService,
  ) {};

  // this for login the user
  @Effect()
  loginStart$ = this.actions$.pipe(
    ofType<LoginStart>(AuthActions.LoginStart),
    switchMap((loginStart) => {
      let updatedPassword = sha256(loginStart.payload.password); 
      const credentials =
      {
        emailId: loginStart.payload.emailId,
        password: updatedPassword,
      };
      const headers = new HttpHeaders({
        // tenantId: btoa('ReactiveAws')   //'ReactiveAws' 'tenatReact' ReactiveMobileTest
        tenantId: btoa('devTest1') 
      });

      return this.http.post(AuthBaseUrl, credentials, { headers })
        .pipe(
          map((response:{firstName:string,lastName:string,role:string,jwtToken:string,accessToken:string, status: string, oneTimeAccessToken: string}) => {
            this.loadingSpinner.isLoading.next(false);
            if(response.status === "Verified"){
              if(response.role === "Admin"){
                localStorage.setItem('auth',btoa(JSON.stringify(response)));
                this.router.navigate(['/home']);
              }else{
                this.toastr.error("Only admin can login");
              }
            }
            return new LoginEnd(
              new UserModel(
                response.firstName,
                response.lastName,
                response.role,
                response.jwtToken,
                response.accessToken,
                response.status,
                response.oneTimeAccessToken)
            );
          }),
          catchError(error => {
            let errorMessage = error.error['message'];
            this.loadingSpinner.isLoading.next(false);
            return of({
              type: AuthActions.LoginFail,
              payload: { errorMessage }
            })
          })
        );
    })
  );

  // to logout the application
  @Effect()
  logoutStart = this.actions$.pipe(
    ofType<LogoutStart>(AuthActions.LogoutStart),
    map(() => {
      localStorage.removeItem('auth')
      this.router.navigateByUrl('/auth');
      return new LogoutEnd();
    }),
  );
}
