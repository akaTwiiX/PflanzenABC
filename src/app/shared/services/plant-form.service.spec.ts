import { TestBed } from '@angular/core/testing';

import { PlantFormService } from './plant-form.service';

describe('PlantFormService', () => {
  let service: PlantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
