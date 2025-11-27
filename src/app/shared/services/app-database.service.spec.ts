import { TestBed } from '@angular/core/testing';

import { AppDatabaseService } from './app-database.service';

describe('AppDatabaseService', () => {
  let service: AppDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
