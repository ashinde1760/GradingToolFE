import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VarifyUserByOtpUrl, CreatePasswordUrl, ForgetPassReqOTPUrl, ForgetPassVerifyOTPUrl, ForgetPassCreatePassUrl } from "src/app/store/effects/URLs";
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false
  constructor( private http: HttpClient, private loadingSpinner: LoadingSpinnerService,) { }

  varifyUserByOtp(email: string, smsOTP: string, emailOTP: string, tanentId: string, accessToken: string){
    const option = { 
      headers: {
        tenantId: btoa(tanentId),
        oneTimeAccessToken: accessToken
      }
    }

    const reqBody = {
      "email": email,
      "emailOtp": emailOTP,
      "smsOtp": smsOTP
    }
    this.loadingSpinner.isLoading.next(false);
    return this.http.post(VarifyUserByOtpUrl, reqBody, option);
  }

  changePassword(password: string, jwtToken: string, accessToken: string){
    let encPassword = sha256(password);
    const option = { 
      headers: {
        oneTimeAccessToken: accessToken,
        jwtToken: jwtToken
      },
    }

    const reqBody = {
      "password": encPassword
    }

    return this.http.post(CreatePasswordUrl, reqBody, option);
  }

  forgetPasswordReqOTP(email: string, tanentId: string){
    let plateType = sha256("web").toString();
    const option = { 
      headers: {
        tenantId: btoa(tanentId),
        platform: plateType
      }
    };

    const reqBody = {
      "emailId": email
    };
    this.loadingSpinner.isLoading.next(false);
    return this.http.post(ForgetPassReqOTPUrl, reqBody, option);
  }

  forgetPassVerifyOTP(tanentId: string, oneTimeAccessToken: string, email: string, smsOTP: string, emailOTP: string){
    const option = { 
      headers: {
        tenantId: btoa(tanentId),
        oneTimeAccessToken: oneTimeAccessToken
      }
    };

    const reqBody = {
      "email": email,
      "emailOtp": emailOTP,
      "smsOtp": smsOTP
    };
    this.loadingSpinner.isLoading.next(false);
    return this.http.post(ForgetPassVerifyOTPUrl, reqBody, option);
  }

  forgetResetPassword(password: string, jwtToken: string, oneTimeAccessToken: string){
    let encryptPass = sha256(password);
    const option = { 
      headers: {
        jwtToken,
        oneTimeAccessToken
      }
    };

    const reqBody = {
      "password": encryptPass
    };

    this.loadingSpinner.isLoading.next(false);
    return this.http.post(ForgetPassCreatePassUrl, reqBody, option);
  }
}
