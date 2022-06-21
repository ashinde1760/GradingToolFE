import { FormStructureComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/form-structure/form-structure.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingComponent } from './components/header/account-setting/account-setting.component';
import { ContactSupportComponent } from './components/header/contact-support/contact-support.component';
import { DashboardComponent } from './components/header/dashboard/dashboard.component';
import { DownloadReportComponent } from './components/header/download-report/download-report.component';
import { HomeComponent } from './components/header/home/home.component';
import { ProjectDetailsComponent } from './components/header/home/active-projects/project-details/project-details.component';
import { LoginComponent } from './components/header/login/login.component';
import { CreateNewFormComponent } from './components/header/manage-rating-forms/create-project-wizard/create-new-form/create-new-form.component';
import { CreateProjectWizardComponent } from './components/header/manage-rating-forms/create-project-wizard/create-project-wizard.component';
import { ManageRatingFormsComponent } from './components/header/manage-rating-forms/manage-rating-forms.component';
import { MasterDataManagementComponent } from './components/header/master-data-management/master-data-management.component';
import { SchedularComponent } from './components/header/schedular/schedular/schedular.component';
import { UserAccessManagementComponent } from './components/header/user-access-management/user-access-management/user-access-management.component';
import { EditProjectWizardComponent } from "./components/header/manage-rating-forms/edit-project-wizard/edit-project-wizard.component";
import { PreviewProjectWizardComponent } from "./components/header/manage-rating-forms/preview-project-wizard/preview-project-wizard.component";
import { DynamicFormComponent } from "./components/header/manage-rating-forms/dynamic-form/dynamic-form.component";
import { 
  AuthGuardService  
} from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:"full"},
  { path: 'auth' ,component: LoginComponent},
  {
    path: 'home', component: HomeComponent,canActivate:[AuthGuardService], children: [
      { path: 'project/:id', component: ProjectDetailsComponent }
    ]
    
  },
  { path: 'user-access-management', component: UserAccessManagementComponent ,canActivate:[AuthGuardService]},

  { path: 'manage-rating-forms', component: ManageRatingFormsComponent,canActivate:[AuthGuardService] },

  { path: 'manage-rating-forms/create-project-wizard', component: CreateProjectWizardComponent ,canActivate:[AuthGuardService]},
  { path: 'manage-rating-forms/create/:id', component: CreateNewFormComponent,canActivate:[AuthGuardService] },
  { path: 'manage-rating-forms/create', component: CreateNewFormComponent,canActivate:[AuthGuardService] },
  { path: 'manage-rating-forms/form/:id', component: FormStructureComponent,canActivate:[AuthGuardService] },

  { path: 'manage-rating-forms/preview-project-wizard', component: PreviewProjectWizardComponent,canActivate:[AuthGuardService] },
  { path: 'manage-rating-forms/preview-project-wizard/:id', component: DynamicFormComponent,canActivate:[AuthGuardService] },


  { path: 'manage-rating-forms/edit-project-wizard', component: EditProjectWizardComponent,canActivate:[AuthGuardService] },
  { path: 'manage-rating-forms/edit-project-wizard/:projectId', component: EditProjectWizardComponent,canActivate:[AuthGuardService] },


  { path: 'scheduler', component: SchedularComponent,canActivate:[AuthGuardService] },

  { path: 'master-data-management', component: MasterDataManagementComponent,canActivate:[AuthGuardService] },

  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuardService] },

  { path: 'download-reports', component: DownloadReportComponent ,canActivate:[AuthGuardService]},
  { path: 'account-settings', component: AccountSettingComponent,canActivate:[AuthGuardService] },
  { path: 'support', component: ContactSupportComponent,canActivate:[AuthGuardService] },
  {path:'**',redirectTo:'home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
