import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCharacterPage } from './select-character.page';

describe('SelectCharacterPage', () => {
  let component: SelectCharacterPage;
  let fixture: ComponentFixture<SelectCharacterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCharacterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
