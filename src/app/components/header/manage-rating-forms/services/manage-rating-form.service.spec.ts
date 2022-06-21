import { TestBed } from '@angular/core/testing';

import { ManageRatingFormService } from './manage-rating-form.service';

describe('ManageRatingFormService', () => {
  let service: ManageRatingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRatingFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
