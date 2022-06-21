import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth/auth.service";
import { Router } from '@angular/router';
import { ActiveProjectsManagementService } from '../home/active-projects/services/active-projects-management.service';
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { LoginStart, LogoutEnd } from "../../../store/actions/auth.actions";
import { interval, Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getError, isLoggedIn, oneTimeAccessToken, user } from 'src/app/store/selectors/auth.selectors';
import {LoadingSpinnerService} from 'src/app/services/loading-spinner/loading-spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  login: FormGroup;
  otpValidate: FormGroup;
  changePassword: FormGroup;
  forgetPassword: FormGroup;
  errorMessage$: Observable<string>;
  isLoading = false;
  showErrorMessage: boolean = false;
  isDisableOtpModel: boolean = true;
  isEnablePasswordChangeModel: boolean= false;
  emailIdForLogin: string;
  oneTimeAccessToken: string;
  oneTimeJwtToken: string;
  showChangePasswordModel: boolean = true;
  forgotPasswordStart: boolean = false;
  forgotPasswordStartFlag: boolean = false;
  isLoggedInSub: Subscription;
  oneTimeAccessTokenSub: Subscription;
  forgetPasswordReqOTPSub: Subscription;
  forgetPassVerifyOTPSub: Subscription;
  varifyUserByOtpSub: Subscription;
  forgetResetPasswordSub: Subscription;
  changePasswordSub: Subscription;
  tanent: string = "devTest1";

  constructor(
    private auth: AuthService,
    private router: Router,
    private activeProjectManagement: ActiveProjectsManagementService,
    private store: Store<AppState>,
    private loadingSpinner: LoadingSpinnerService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {  
    if(localStorage.getItem('auth')){
      this.router.navigate(['home'])
    }
    this.login = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.otpValidate = new FormGroup({
      mobileOTP: new FormControl('', Validators.required),
      emailOTP: new FormControl('', Validators.required)
    });

    this.changePassword = new FormGroup({
      newPassword: new FormControl('', Validators.required),
      newConfirmPassword: new FormControl('', Validators.required)
    });

    this.forgetPassword = new FormGroup({
      email : new FormControl('', Validators.required)
    });
  }

  // to login in the application
  onSubmit() {
    this.emailIdForLogin = this.login.get('email').value;
    const password = this.login.get('password').value;
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new LoginStart({ emailId: this.emailIdForLogin, password }));
    this.isLoggedInSub = this.store.pipe(select(user)).subscribe(
      (data) => {
        if(data?.status && data?.status == "Un-Verified"){
          this.isDisableOtpModel = false;
          this.login.reset();
        }
      }
    );
    this.errorMessage$ = this.store.select(getError);
  }

  // to validate the otp that user get in email and sms to reset the passowrd.
  onOTPValidate(){
    const mobileOTPVal = this.otpValidate.get('mobileOTP').value;
    const emailOTPVal = this.otpValidate.get('emailOTP').value;
    this.loadingSpinner.isLoading.next(true);
    if(this.forgotPasswordStartFlag){
      this.forgetPassVerifyOTPSub = this.authService.forgetPassVerifyOTP(this.tanent, this.oneTimeAccessToken, this.emailIdForLogin, mobileOTPVal, emailOTPVal).subscribe(
        (data: {verificationStatus: boolean, jwtToken: string}) =>{
          if(data.verificationStatus){
            this.otpValidate.reset();
            this.oneTimeJwtToken = data.jwtToken;
            this.isDisableOtpModel = true;
            this.isEnablePasswordChangeModel = data.verificationStatus;
          }
        },
        (error: HttpErrorResponse) =>{
          if(error.error["errorCode"] == 401){
            this.router.navigateByUrl('/auth');
            this.store.dispatch(new LogoutEnd());
          }
          this.toastr.error(error.error['message'],'Failed!');
        }
      );
    }else{
      this.oneTimeAccessTokenSub = this.store.pipe(select(oneTimeAccessToken)).subscribe(
        (data) => {
          this.oneTimeAccessToken = data;
          this.isDisableOtpModel = true;
        }
      );
      this.varifyUserByOtpSub = this.authService.varifyUserByOtp(this.emailIdForLogin, mobileOTPVal, emailOTPVal, this.tanent, this.oneTimeAccessToken).subscribe(
        (data: {verificationStatus: boolean, jwtToken: string}) =>{
          this.isEnablePasswordChangeModel = data.verificationStatus;
          this.oneTimeJwtToken = data.jwtToken;
          this.otpValidate.reset();
        },
        (error: HttpErrorResponse) =>{
          if(error.error["errorCode"] == 401){
            this.router.navigateByUrl('/auth');
            this.store.dispatch(new LogoutEnd());
          }
          this.otpValidate.reset();
          this.toastr.error(error.error['message'],'Failed!');
        }
      );
    }
  }

  // to create/reset the password for user 
  onChangePassword(){
    const newPassValue = this.changePassword.get('newPassword').value;
    if(this.forgotPasswordStartFlag){
      this.forgetResetPasswordSub = this.authService.forgetResetPassword(newPassValue, this.oneTimeJwtToken, this.oneTimeAccessToken).subscribe(
        (data: {status: string}) =>{
         if(data.status == "success"){
          this.changePassword.reset();
          this.showChangePasswordModel = false;
         }
        },
        (error: HttpErrorResponse) =>{
          if(error.error["errorCode"] == 401){
            this.router.navigateByUrl('/auth');
            this.store.dispatch(new LogoutEnd());
          }
        }
      );
    }else{
      this.changePasswordSub = this.authService.changePassword(newPassValue, this.oneTimeJwtToken, this.oneTimeAccessToken).subscribe(
        (data) => {
          this.changePassword.reset();
          this.showChangePasswordModel = false;
        },
        (error: HttpErrorResponse) =>{
          if(error.error["errorCode"] == 401){
            this.router.navigateByUrl('/auth');
            this.store.dispatch(new LogoutEnd());
          }
        }
      );
    }
  }

  closePasswordGreet(){
    this.isDisableOtpModel = true;
    this.isEnablePasswordChangeModel = false;
    this.showChangePasswordModel = true;
    this.forgotPasswordStartFlag = false;
  }

  onForgotPasswordStart(){
    this.forgotPasswordStart = true;
    this.forgotPasswordStartFlag = true;
  }

  // to request the otp to varify the email and user to set password(forget passowrd).
  fpRequestOTP(){
    this.emailIdForLogin = this.forgetPassword.get("email").value;
    this.forgetPasswordReqOTPSub = this.authService.forgetPasswordReqOTP(this.emailIdForLogin, this.tanent).subscribe(
      (data: {oneTimeAccessToken: string, status: string}) =>{
        if(data.status && data.status == "Verified"){
          this.forgetPassword.reset();
          this.forgotPasswordStart = false; 
          this.isDisableOtpModel = false;
          this.oneTimeAccessToken = data.oneTimeAccessToken;
        }
      },
      (error: HttpErrorResponse) =>{
        this.toastr.error('Please enter the valid email/username.','Failed!');
      }
    );
  }

  ngOnDestroy(){
    if(this.isLoggedInSub){
      this.isLoggedInSub.unsubscribe();
    }
    if(this.oneTimeAccessTokenSub){
      this.oneTimeAccessTokenSub.unsubscribe();
    }
    if(this.forgetPasswordReqOTPSub){
      this.forgetPasswordReqOTPSub.unsubscribe();
    }

    if(this.forgetPassVerifyOTPSub){
      this.forgetPassVerifyOTPSub.unsubscribe();
    }

    if(this.varifyUserByOtpSub){
      this.varifyUserByOtpSub.unsubscribe();
    }

    if(this.forgetResetPasswordSub){
      this.forgetResetPasswordSub.unsubscribe();
    }

    if(this.changePasswordSub){
      this.changePasswordSub.unsubscribe();
    }
  }
}
