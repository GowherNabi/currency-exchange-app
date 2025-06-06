import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateSelectorComponent } from './date-selector.component';
import { By } from '@angular/platform-browser';

describe('DateSelectorComponent', () => {
  let component: DateSelectorComponent;
  let fixture: ComponentFixture<DateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateSelectorComponent], // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(DateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default selectedDate as today', () => {
    const today = new Date().toDateString();
    expect(component.selectedDate()?.toDateString()).toBe(today);
  });

  it('should return correct maxDate (today)', () => {
    const expected = new Date();
    const formatted = expected.toISOString().split('T')[0];
    expect(component.maxDate).toBe(formatted);
  });

  it('should return correct minDate (90 days ago)', () => {
    const expected = new Date();
    expected.setDate(expected.getDate() - 90);
    const formatted = expected.toISOString().split('T')[0];
    expect(component.minDate).toBe(formatted);
  });

  it('should emit selectedDateChange on input change', () => {
    spyOn(component.selectedDateChange, 'emit');
    const testDate = '2023-01-01';
    const input = document.createElement('input');
    input.value = testDate;

    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: input });

    component.onDateChange(event);

    expect(component.selectedDateChange.emit).toHaveBeenCalledWith(
      new Date(testDate)
    );
  });
});
