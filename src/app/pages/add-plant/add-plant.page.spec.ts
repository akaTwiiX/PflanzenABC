import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AddPlantPage } from '@/pages/add-plant/add-plant.page';

describe('addPlantPage', () => {
  let component: AddPlantPage;
  let fixture: ComponentFixture<AddPlantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
