import { TestBed } from '@angular/core/testing';

import { UpdaterService } from '@/shared/services/updater.service';

describe('updaterService', () => {
  let service: UpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
