import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainTabsPage } from './main-tabs.page';

describe('MainTabsPage', () => {
  let component: MainTabsPage;
  let fixture: ComponentFixture<MainTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
