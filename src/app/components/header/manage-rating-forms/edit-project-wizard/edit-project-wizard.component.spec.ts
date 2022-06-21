import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectWizardComponent } from './edit-project-wizard.component';

describe('EditProjectWizardComponent', () => {
  let component: EditProjectWizardComponent;
  let fixture: ComponentFixture<EditProjectWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
