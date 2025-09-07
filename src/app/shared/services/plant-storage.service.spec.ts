import { TestBed } from '@angular/core/testing';

import { PlantStorageService } from './plant-storage.service';

describe('PlantStorageService', () => {
  let service: PlantStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
