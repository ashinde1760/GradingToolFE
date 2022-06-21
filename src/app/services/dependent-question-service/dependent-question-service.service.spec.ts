import { TestBed } from '@angular/core/testing';

import { DependentQuestionServiceService } from './dependent-question-service.service';

describe('DependentQuestionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DependentQuestionServiceService = TestBed.get(DependentQuestionServiceService);
    expect(service).toBeTruthy();
  });
});
