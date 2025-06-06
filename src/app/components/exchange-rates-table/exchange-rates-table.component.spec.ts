import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeRatesTableComponent } from './exchange-rates-table.component';

describe('ExchangeRatesTableComponent', () => {
  let component: ExchangeRatesTableComponent;
  let fixture: ComponentFixture<ExchangeRatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRatesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeRatesTableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display rates in table', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(2); // Header + data row

    const usdCell = fixture.nativeElement.querySelector('td:nth-child(2)');
    expect(usdCell.textContent).toContain('1.25');
  });

  it('should emit sort event', () => {
    spyOn(component.sortChange, 'emit');
    const header = fixture.nativeElement.querySelector('th');
    header.click();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      column: 'date',
      direction: 'asc',
    });
  });
});
