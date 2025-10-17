import { TestBed } from '@angular/core/testing';

import { BackupStateService } from './backup-state.service';

describe('BackupStateService', () => {
  let service: BackupStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
