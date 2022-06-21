import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppState } from 'src/app/store';
import { getReportState } from 'src/app/store/selectors/report.selectors';

@Component({
  selector: 'app-partner-report',
  templateUrl: './partner-report.component.html',
  styleUrls: ['./partner-report.component.css']
})
export class PartnerReportComponent implements OnInit {
//   formObj = {
//     "reportHeader": {
//         "projectName": "xyz",
//         "PIA": "Abbey West Services Private Limited",
//         "partnerProjectId": "1212",
//         "partnerSPOCName": "Abhey M",
//         "partnerSPOCPhone": "112121212",
//         "partnerSPOCEmailId": "21@gmail.com",
//         "fieldAuditorName": "qwq",
//         "secondaryAuditorName": "qwqw2"
//     },
//     "reportBody": {
//         "summaryReport": {
//             "centerRating": 92.00,
//             "projectGrading": 80.00,
//             "finalAvg": 84.60,
//             "grade": "A+"
//         },
//         "centerRatingSummary": [
//             {
//                 "trainingCenter": "TC1",
//                 "TCAddress": "HSR,Bangalore",
//                 "TCSPOCName": "qwqw",
//                 "SAScore": 296,
//                 "FAScore": 295,
//                 "maxMarks": 300
//             },
//             {
//                 "trainingCenter": "TC2",
//                 "TCAddress": "HSR,Bangalore",
//                 "TCSPOCName": "qwqw",
//                 "SAScore": 296,
//                 "FAScore": 295,
//                 "maxMarks": 300
//             },
//             {
//                 "trainingCenter": "TC3",
//                 "TCAddress": "HSR,Bangalore",
//                 "TCSPOCName": "qwqw",
//                 "SAScore": 296,
//                 "FAScore": 295,
//                 "maxMarks": 300
//             },
//             {
//                 "trainingCenter": "TC4",
//                 "TCAddress": "HSR,Bangalore",
//                 "TCSPOCName": "qwqw",
//                 "SAScore": 296,
//                 "FAScore": 295,
//                 "maxMarks": 300
//             }
//         ],
//         "projectGradingSummary": {
//             "SAScore": 180,
//             "FAScore": 180,
//             "maxMarks": 200
//         }
//     }
//   };
 
private reportSubscription: Subscription;
formObj = null;  
SAScoreTotal:number = 0;
FAScoreTotal:number = 0;
maxMarksTotal: number = 0;
@Input() isLoading: boolean;
@Output() isLoadingChange = new EventEmitter<boolean>();
constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    //   this.store.select((state) => {
    //     this.formObj = state.report.projectReport;
    //   });
    this.reportSubscription = this.store.pipe(select(getReportState)).subscribe((data) => {
      console.log("data: ", data);
      this.SAScoreTotal = 0;
      this.FAScoreTotal = 0;
      this.maxMarksTotal = 0;
      if(data.partnerReport !== null){
        this.isLoadingChange.emit(false);
      }else{
        this.isLoadingChange.emit(true);
      }
      this.formObj = data.partnerReport;
      if(this.formObj && this.formObj.reportBody){
        for (const centerRating of this.formObj.reportBody.centerRatingSummary) {
          this.SAScoreTotal = this.SAScoreTotal + centerRating.SAScore;
          this.FAScoreTotal = this.FAScoreTotal + centerRating.FAScore;
          this.maxMarksTotal = this.maxMarksTotal + centerRating.maxMarks;
        }
      }
    });
  }

  ngOnDestroy(){
    this.reportSubscription.unsubscribe();
  }

}
