import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PlantPage } from '@/pages/plant/plant.page';

describe('plantPage', () => {
  let component: PlantPage;
  let fixture: ComponentFixture<PlantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
