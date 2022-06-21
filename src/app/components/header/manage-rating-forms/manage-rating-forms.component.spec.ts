import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRatingFormsComponent } from './manage-rating-forms.component';

describe('ManageRatingFormsComponent', () => {
  let component: ManageRatingFormsComponent;
  let fixture: ComponentFixture<ManageRatingFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRatingFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRatingFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
