import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerReportComponent } from './partner-report.component';

describe('PartnerReportComponent', () => {
  let component: PartnerReportComponent;
  let fixture: ComponentFixture<PartnerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
