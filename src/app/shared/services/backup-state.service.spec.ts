import { TestBed } from '@angular/core/testing';

import { BackupStateService } from '@/shared/services/backup-state.service';

describe('backupStateService', () => {
  let service: BackupStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
