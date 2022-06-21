import { SchedulerEffects } from './store/effects/scheduler.effects';
import { PartnerEffects } from './store/effects/patner.effects';
import { MasterDataEffects } from './store/effects/master-data.effects';
import { UserEffects } from './store/effects/user.effects';
import { FormEffects } from './store/effects/form.effects';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserAccessManagementComponent } from './components/header/user-access-management/user-access-management/user-access-management.component';
import { SingleUserComponent } from './components/header/user-access-management/user-access-management/single-user/single-user.component';
import { DashboardComponent } from './components/header/dashboard/dashboard.component';
import { DownloadReportComponent } from './components/header/download-report/download-report.component';
import { AccountSettingComponent } from './components/header/account-setting/account-setting.component';
import { ContactSupportComponent } from './components/header/contact-support/contact-support.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/header/home/home.component';
import { LoginComponent } from './components/header/login/login.component';
import { HeadingComponent } from './components/UI/heading/heading.component';

import { ProjectsComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/projects.component';
import { CreateSurveyComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/create-survey/create-survey.component';
import { CreateSurveyQuestionComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/create-survey-question/create-survey-question.component';
import { DeleteOptionComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/create-survey-question/delete-option/delete-option.component';
import { ReviewOptionsComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/create-survey-question/review-options/review-options.component';
import { DisplayComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/display/display.component';
import { DisplayQuestionListComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/display/display-question-list/display-question-list.component';

import { SchedularComponent } from './components/header/schedular/schedular/schedular.component';

import { ManageRatingFormsComponent } from './components/header/manage-rating-forms/manage-rating-forms.component';
import { ProjectDetailsComponent } from './components/header/home/active-projects/project-details/project-details.component';
import { ActiveProjectsComponent } from './components/header/home/active-projects/active-projects.component';
import { MasterDataManagementComponent } from './components/header/master-data-management/master-data-management.component';
import { MasterDataManagementFilterPipe } from './pipes/master-data-management-filter.pipe';
import { CreateNewFormComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/create-new-form.component';

import { CreateProjectWizardComponent } from './components/header/manage-rating-forms/create-project-wizard/create-project-wizard.component';
import { EditProjectWizardComponent } from './components/header/manage-rating-forms/edit-project-wizard/edit-project-wizard.component';

import { DynamicFormComponent } from './components/header/manage-rating-forms/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './components/header/manage-rating-forms/dynamic-form/dynamic-form-question/dynamic-form-question.component';
import { CustomInputComponent } from './components/header/manage-rating-forms/custom-input/custom-input.component';
import { PreviewProjectWizardComponent } from './components/header/manage-rating-forms/preview-project-wizard/preview-project-wizard.component';


import { appReducer } from "./store";
import { environment } from '../environments/environment';
import { AuthEffects } from "./store/effects/auth.effects";
import { ProjectEffects } from "./store/effects/project.effects";
import { SurveyEffects } from './store/effects/survey.effects'
import { DisplayProjectsPipe } from './pipes/display-projects.pipe';
import { AuthSpinnerComponent } from './components/ui/auth-spinner/auth-spinner.component';
import { EditSurveyFormContainerComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/edit-survey-form-container/edit-survey-form-container.component';
import { EditSurveyFormComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/projects/edit-survey-form-container/edit-survey-form/edit-survey-form.component';
import { CenterReportComponent } from './components/header/report/center-report/center-report.component';
import {PartnerReportComponent} from './components/header/report/partner-report/partner-report.component';
import { ProjectReportComponent } from './components/header/report/project-report/project-report.component'
import { CommonModule } from '@angular/common';
import { FormStructureComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/form-structure/form-structure.component';
import { DropdownQuestionComponent } from './components/header/manage-rating-forms/dynamic-form/dropdown-question/dropdown-question.component';
import {SettingEffects} from './store/effects/setting.effects';
import { ReportEffects } from 'src/app/store/effects/report.effects';
import { DownloadReportEffects } from 'src/app/store/effects/download-report.effects';
import { ConfirmEqualValidatorDirective } from 'src/app/directives/confirm-equal-validator.directive'




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserAccessManagementComponent,
    ProjectsComponent,
    DashboardComponent,
    DownloadReportComponent,
    AccountSettingComponent,
    ContactSupportComponent,
    HeaderComponent,
    HomeComponent,
    HeadingComponent,
    CreateSurveyComponent,
    CreateSurveyQuestionComponent,
    DeleteOptionComponent,
    ReviewOptionsComponent,
    DisplayComponent,
    SingleUserComponent,
    ManageRatingFormsComponent,
    FormStructureComponent,
    DisplayQuestionListComponent,
    ProjectDetailsComponent,
    ActiveProjectsComponent,
    MasterDataManagementComponent,
    MasterDataManagementFilterPipe,
    CreateNewFormComponent,

    SchedularComponent,
    CreateProjectWizardComponent,
    EditProjectWizardComponent,
    PartnerReportComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    CustomInputComponent,
    PreviewProjectWizardComponent,
    DisplayProjectsPipe,
    AuthSpinnerComponent,
    EditSurveyFormContainerComponent,
    EditSurveyFormComponent,
    CenterReportComponent,
    ProjectReportComponent,
    DropdownQuestionComponent,
    ConfirmEqualValidatorDirective

  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleChartsModule,
    ToastrModule.forRoot({
      autoDismiss: false,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      closeButton:true
    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 60,
      space: -10,
      showInnerStroke: true,

      outerStrokeWidth: 10,
      outerStrokeColor: '#4882c2',

      innerStrokeColor: '#707070',
      innerStrokeWidth: 10,

      animateTitle: false,
      animationDuration: 1000,
      showUnits: false,
      showBackground: false,

      startFromZero: false

    }),
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, ProjectEffects, SurveyEffects, FormEffects, UserEffects, MasterDataEffects, PartnerEffects, DownloadReportEffects, ReportEffects, SchedulerEffects,SettingEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
