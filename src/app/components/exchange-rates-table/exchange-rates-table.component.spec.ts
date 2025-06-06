import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeRatesTableComponent } from './exchange-rates-table.component';
import { ExchangeRate } from '../../models/exchange-rate.model';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct rate for a given currency using getRate method', () => {
    const mockExchangeRate: ExchangeRate = {
      date: new Date('2023-10-01'),
      rates: {
        usd: 1.0,
        eur: 0.85,
      },
      baseCurrency: '',
    };
    const rate = component.getRate(mockExchangeRate, 'eur');
    expect(rate).toBe(0.85);
  });

  it('should return null from getRate when the currency is not found in rates', () => {
    const mockExchangeRate: ExchangeRate = {
      date: new Date('2023-10-01'),
      rates: {
        usd: 1.0,
        eur: 0.85,
      },
      baseCurrency: '',
    };
    const rate = component.getRate(mockExchangeRate, 'gbp');
    expect(rate).toBeNull();
  });

  it('should toggle sort direction when the same column is clicked twice', () => {
    component.onSort('date');
    expect(component.currentSortDirection).toBe('desc');
    component.onSort('date');
    expect(component.currentSortDirection).toBe('asc');
  });

  it("should set sort direction to 'asc' when a new column is clicked", () => {
    component.onSort('currency');
    expect(component.currentSortColumn).toBe('currency');
    expect(component.currentSortDirection).toBe('asc');
  });

  it('should emit sortChange event with correct column and direction on sort', () => {
    spyOn(component.sortChange, 'emit');

    component.onSort('currency');

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      column: 'currency',
      direction: 'asc',
    });

    component.onSort('currency');

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      column: 'currency',
      direction: 'desc',
    });
  });

  it("should initialize with 'date' as the default sort column", () => {
    expect(component.currentSortColumn).toBe('date');
  });

  it("should initialize with 'asc' as the default sort direction", () => {
    expect(component.currentSortDirection).toBe('asc');
  });

  it("should return '↕' as the sort icon for a column that is not the current sort column", () => {
    component.currentSortColumn = 'date';
    const icon = component.getSortIcon('currency');
    expect(icon).toBe('↕');
  });
});
