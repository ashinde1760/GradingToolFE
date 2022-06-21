import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store';
import { getReportState } from 'src/app/store/selectors/report.selectors';

@Component({
  selector: 'app-center-report',
  templateUrl: './center-report.component.html',
  styleUrls: ['./center-report.component.css']
})
export class CenterReportComponent implements OnInit {

public formObj = null;  
private reportSubscription: Subscription;
@Input() isLoading: boolean;
@Output() isLoadingChange = new EventEmitter<boolean>();
constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.reportSubscription = this.store.pipe(select(getReportState)).subscribe((data) => {
      // if(data.triningCenterReport !== null){
      //   this.isLoadingChange.emit(false);
      // }else{
      //   this.isLoadingChange.emit(true);
      // }
      this.formObj = data.triningCenterReport;
    });
  }

  ngOnDestroy(){
    if(this.reportSubscription){
      this.reportSubscription.unsubscribe();
    }
  }

}
