import { TestBed } from '@angular/core/testing';

import { QuestionControllerService } from './question-controller.service';

describe('QuestionControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionControllerService = TestBed.get(QuestionControllerService);
    expect(service).toBeTruthy();
  });
});
