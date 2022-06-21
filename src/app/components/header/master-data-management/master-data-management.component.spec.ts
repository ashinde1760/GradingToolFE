import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataManagementComponent } from './master-data-management.component';

describe('MasterDataManagementComponent', () => {
  let component: MasterDataManagementComponent;
  let fixture: ComponentFixture<MasterDataManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDataManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
