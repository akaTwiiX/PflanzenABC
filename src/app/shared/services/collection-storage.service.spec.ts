import { TestBed } from '@angular/core/testing';

import { CollectionStorageService } from '@/shared/services/collection-storage.service';

describe('collectionStorageService', () => {
  let service: CollectionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
