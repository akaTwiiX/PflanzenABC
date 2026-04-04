import { TestBed } from '@angular/core/testing';

import { ChoicesStorageService } from '@/shared/services/choices-storage.service';

describe('choicesStorageService', () => {
  let service: ChoicesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoicesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
