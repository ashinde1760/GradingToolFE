import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FetchProjectsStart } from 'src/app/store/actions/project.actions';
import { ManageRatingFormService } from "./services/manage-rating-form.service";
@Component({
  selector: 'app-manage-rating-forms',
  templateUrl: './manage-rating-forms.component.html',
  styleUrls: ['./manage-rating-forms.component.css']
})
export class ManageRatingFormsComponent {

  constructor(public manageRatingFormService: ManageRatingFormService,public store:Store) { }
  toggleDisplayMenu() {
    this.manageRatingFormService.showMenu = !this.manageRatingFormService.showMenu
  }
  ngOnInit() {
    this.store.dispatch(new FetchProjectsStart());
    this.manageRatingFormService.showMenu = true

  }

}
