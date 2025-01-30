import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RpgPage } from './rpg.page';

describe('RpgPage', () => {
  let component: RpgPage;
  let fixture: ComponentFixture<RpgPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RpgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
