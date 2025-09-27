import { TestBed } from '@angular/core/testing';

import { ChoicesStorageService } from './choices-storage.service';

describe('ChoicesStorageService', () => {
  let service: ChoicesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoicesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
