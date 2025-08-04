import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlantPage } from './add-plant.page';

describe('AddPlantPage', () => {
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
