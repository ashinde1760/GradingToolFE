import { TestBed } from '@angular/core/testing';

import { CreateSurveyUtilityService } from './create-survey-utility.service';

describe('CreateSurveyUtilityService', () => {
  let service: CreateSurveyUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateSurveyUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
