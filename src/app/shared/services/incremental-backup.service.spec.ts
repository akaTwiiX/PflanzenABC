import { TestBed } from '@angular/core/testing';

import { IncrementalBackupService } from '@/shared/services/incremental-backup.service';

describe('incrementalBackupService', () => {
  let service: IncrementalBackupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncrementalBackupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
