import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MainTabsPage } from '@/pages/main-tabs/main-tabs.page';

describe('mainTabsPage', () => {
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
