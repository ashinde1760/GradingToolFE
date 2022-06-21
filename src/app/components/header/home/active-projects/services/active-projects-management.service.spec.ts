import { TestBed } from '@angular/core/testing';

import { ActiveProjectsManagementService } from './active-projects-management.service';

describe('ActiveProjectsManagementService', () => {
  let service: ActiveProjectsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveProjectsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
