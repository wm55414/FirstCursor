import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeText } from './type-text';

describe('TypeText', () => {
  let component: TypeText;
  let fixture: ComponentFixture<TypeText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
