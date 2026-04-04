import { TestBed } from '@angular/core/testing';

import { PlantFormService } from '@/shared/services/plant-form.service';

describe('plantFormService', () => {
  let service: PlantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
