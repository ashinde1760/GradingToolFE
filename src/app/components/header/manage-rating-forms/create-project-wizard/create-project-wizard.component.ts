import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from "@ngrx/store";
import { AppState } from "../../../../store";
import { CreateProjectStart } from "../../../../store/actions/project.actions";
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-create-project-wizard',
  templateUrl: './create-project-wizard.component.html',
  styleUrls: ['./create-project-wizard.component.css']
})
export class CreateProjectWizardComponent implements OnInit {
  editProjectWizard: FormGroup;
  isLoading: boolean = false;
  currentDate: number;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private loadingSpinner: LoadingSpinnerService) {
  }

  createProject(): void {
    if (this.editProjectWizard.valid) {
      this.loadingSpinner.isLoading.next(true);
      const title = this.editProjectWizard.get('title').value;
      const description = this.editProjectWizard.get('description').value;
      let startDate = this.editProjectWizard.get('startDate').value;
      let endDate = this.editProjectWizard.get('endDate').value;
      let selfAssesmentDeadLine = this.editProjectWizard.get('selfAssesmentDeadLine').value;
      endDate = endDate.split('-').reverse().join('-');
      startDate = startDate.split('-').reverse().join('-');
      selfAssesmentDeadLine = selfAssesmentDeadLine.split('-').reverse().join('-');
      this.store.dispatch(
        new CreateProjectStart(
          {
            projectName: title,
            projectDescription: description,
            startDate: startDate,
            endDate: endDate,
            selfAssignmentDeadLine: selfAssesmentDeadLine
          }));

    } else {
      Object.keys(this.editProjectWizard.controls).forEach(field => {
        const control = this.editProjectWizard.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/manage-rating-forms']);
  }

  ngOnInit(): void {
    this.currentDate = Date.now();
    this.editProjectWizard = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      selfAssesmentDeadLine: new FormControl(null, Validators.required)
    });

    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
  }

}
