import { TestBed } from '@angular/core/testing';

import { PlantStorageService } from '@/shared/services/plant-storage.service';

describe('plantStorageService', () => {
  let service: PlantStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
