import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store';
import { getReportState } from 'src/app/store/selectors/report.selectors';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
//   formObj = {
//     "reportHeader": {
//         "projectName": "xyz",
//         "date": "16/10/2020",
//         "partnersIncluded": 26,
//         "tcIncluded": 30
//     },
//     "reportBody": {
//         "partnersSummary": [
//             {
//                 "PIA": "Abbey West Services Private Limited",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "ASD Education Private Limited",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Asmacs Systems Solutions Pvt Ltd",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Gram Tarang Employability Training Services",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Shahi Exports Private Limited",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Asmacs Skill Development Ltd",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Black Panther Guards and Services Pvt Ltd",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }, {
//                 "PIA": "Cotton Blossom India Private Limited",
//                 "centerRating": 90.00,
//                 "projectGrading": 80.00,
//                 "finalAvg": 84.86,
//                 "grade": "A+"
//             }
//         ]
//     }
//   };
public formObj = null;  
private reportSubscription: Subscription;
@Input() isLoading: boolean;
@Output() isLoadingChange = new EventEmitter<boolean>();
constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.reportSubscription = this.store.pipe(select(getReportState)).subscribe((data) => {
      if(data.projectReport !== null){
        this.isLoadingChange.emit(false);
      }else{
        this.isLoadingChange.emit(true);
      }
      this.formObj = data.projectReport;
    });
  }

  ngOnDestroy(){
    this.reportSubscription.unsubscribe();
  }
}
