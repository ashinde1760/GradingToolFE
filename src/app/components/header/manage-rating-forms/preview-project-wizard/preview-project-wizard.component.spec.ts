import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProjectWizardComponent } from './preview-project-wizard.component';

describe('PreviewProjectWizardComponent', () => {
  let component: PreviewProjectWizardComponent;
  let fixture: ComponentFixture<PreviewProjectWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewProjectWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewProjectWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
