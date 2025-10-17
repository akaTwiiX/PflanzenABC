import { TestBed } from '@angular/core/testing';

import { IncrementalBackupService } from './incremental-backup.service';

describe('IncrementalBackupService', () => {
  let service: IncrementalBackupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncrementalBackupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
