import { Component, OnDestroy, OnInit, NgModule  } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store';
import {  } from 'src/app/directives/confirm-equal-validator.directive';
import { AccountResponse, LoadAccountStarts, UpdateSettingStarts } from '../../../store/actions/setting.actions';
import { AccountDetails } from '../../../store/selectors/setting.selectors';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit, OnDestroy {

  public accountDetailsSubscription: Subscription;
  public accountData: any = null;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadAccountStarts());
    // to get the details of the user account like firstname, lastname, email, phone, role.
    this.accountDetailsSubscription = this.store.pipe(select(AccountDetails)).subscribe((data) =>{
      this.accountData = {...data};
    });
  }

  updateAccount(formValue){
    if(formValue.firstName.value || formValue.lastName.value){
      let userData = {
        "firstName": formValue.firstName.value.trim(),
        "lastName":  formValue.lastName.value.trim(),
        "email": this.accountData.email,
        "phone": this.accountData.phone,
        "role": this.accountData.role
      };
      let toUpdateRequest = "name";
      // to update account details.
      this.store.dispatch(new UpdateSettingStarts({requestActionType: toUpdateRequest, userId: this.accountData.userId, requestBody: userData}));    
    }
  }

  resetPassword(formValue){
    if(formValue.controls.oldPassword?.value && formValue.controls.newPassword?.value && formValue.controls.newConfirmPassword?.value){   
      let oldPassword = sha256(formValue.controls.oldPassword?.value);
      let newPassword = sha256(formValue.controls.newPassword?.value);
      let newConfirmPassword = sha256(formValue.controls.newConfirmPassword?.value);
      let passwordData = {
        "oldPassword": oldPassword,
        "newPassword": newPassword,
        "confirmPassword": newConfirmPassword
      };
      let toUpdateRequest = "password";
      // to update the passowrd of user account.
      this.store.dispatch(new UpdateSettingStarts({requestActionType: toUpdateRequest, userId: this.accountData.userId, requestBody: passwordData}));
      formValue.reset();
    }
  }

  ngOnDestroy(){
    this.accountDetailsSubscription.unsubscribe();
  }
}
