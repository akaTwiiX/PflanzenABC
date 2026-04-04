import { TestBed } from '@angular/core/testing';

import { AppDatabaseService } from '@/shared/services/app-database.service';

describe('appDatabaseService', () => {
  let service: AppDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
