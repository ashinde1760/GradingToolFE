import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ManageRatingFormService {
  showMenu = true;
  projectDetails;
  form: FormGroup

  constructor() {
  }

  createEditProjectWizardForm(): FormGroup {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      selfAssesmentDeadLine: new FormControl(null, [Validators.required])
    });
    return this.form
  }

  validateStartDate(formControl: FormControl): { [s: string]: boolean } {

    const startDate = formControl.value

    if (Date.parse(new Date() + '') - Date.parse(startDate) <= 0) {
      return { 'invalid Start Date': false }
    }
    return null
  }

  validateEndDate(formGroup: FormGroup): { [s: string]: boolean } {
    if (formGroup) {
      const endDate = formGroup.get('endDate').value
      const startDate = formGroup.get('startDate').value
      if (Date.parse(endDate) - Date.parse(startDate) <= 0) {
        return { 'invalid End Date': false }
      }
    }
    return null
  }

  // createProjectWizardForm(): void {
  //   this.editProjectWizard = new FormGroup({
  //     title: new FormControl(null, Validators.required),
  //     description: new FormControl(null, Validators.required),
  //     startDate: new FormControl(null, Validators.required),
  //     endDate: new FormControl(null, Validators.required),
  //   });
  // }
}
