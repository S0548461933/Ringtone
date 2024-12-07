import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HebrewCalendarComponent } from './hebrew-calendar.component';

describe('HebrewCalendarComponent', () => {
  let component: HebrewCalendarComponent;
  let fixture: ComponentFixture<HebrewCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HebrewCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HebrewCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
