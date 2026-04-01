import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admire } from './admire';

describe('Admire', () => {
  let component: Admire;
  let fixture: ComponentFixture<Admire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
