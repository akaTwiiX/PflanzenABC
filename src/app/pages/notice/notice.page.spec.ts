import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NoticePage } from '@/pages/notice/notice.page';

describe('noticePage', () => {
  let component: NoticePage;
  let fixture: ComponentFixture<NoticePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
