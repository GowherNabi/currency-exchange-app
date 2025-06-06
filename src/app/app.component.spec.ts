import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // <-- import this
import { AppComponent } from './app.component';
import { ExchangeRateService } from './services/exchange-rate.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockExchangeRateService: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(async () => {
    mockExchangeRateService = jasmine.createSpyObj('ExchangeRateService', [
      'getExchangeRatesForWeek',
    ]);
    mockExchangeRateService.getExchangeRatesForWeek.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule, // <-- add this here
      ],
      providers: [
        { provide: ExchangeRateService, useValue: mockExchangeRateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load exchange rates on init', () => {
    expect(mockExchangeRateService.getExchangeRatesForWeek).toHaveBeenCalled();
  });

  it('should handle currency changes', () => {
    component.onBaseCurrencyChange('eur');
    expect(component.baseCurrency()).toBe('eur');
    expect(
      mockExchangeRateService.getExchangeRatesForWeek
    ).toHaveBeenCalledTimes(2);
  });

  it('should handle target currency changes and update targetCurrencies signal correctly', () => {
    const newCurrencies = ['usd', 'cad'];
    component.onSelectedCurrenciesChange(newCurrencies);
    expect(component.targetCurrencies()).toEqual(newCurrencies);
    expect(
      mockExchangeRateService.getExchangeRatesForWeek
    ).toHaveBeenCalledTimes(2);
  });

  it('should update endDate signal correctly when onDateChange is called', () => {
    const newDate = new Date('2023-10-01');
    component.onDateChange(newDate);
    expect(component.endDate()).toEqual(newDate);
    expect(
      mockExchangeRateService.getExchangeRatesForWeek
    ).toHaveBeenCalledTimes(2);
  });

  it('should handle successful exchange rates loading and update the exchangeRates signal', () => {
    const mockRates = [
      {
        date: new Date('2023-05-01'),
        baseCurrency: 'gbp',
        rates: { usd: 1.25, eur: 1.12 },
      },
      {
        date: new Date('2023-05-02'),
        baseCurrency: 'gbp',
        rates: { usd: 1.26, eur: 1.13 },
      },
    ];

    mockExchangeRateService.getExchangeRatesForWeek.and.returnValue(
      of(mockRates)
    );

    component.loadExchangeRates();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
    expect(component.exchangeRates()).toEqual(mockRates);
    expect(
      mockExchangeRateService.getExchangeRatesForWeek
    ).toHaveBeenCalledWith(
      component.baseCurrency(),
      component.targetCurrencies(),
      component.endDate()
    );
  });

  it('should set error message when exchange rates response is empty', () => {
    // Setup empty response
    mockExchangeRateService.getExchangeRatesForWeek.and.returnValue(of([]));

    // Clear any previous state
    component.error.set(null);

    // Call the method
    component.loadExchangeRates();

    // Verify error message is set correctly
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe(
      'No data available for the selected date range'
    );
    expect(component.exchangeRates()).toEqual([]);
    expect(mockExchangeRateService.getExchangeRatesForWeek).toHaveBeenCalled();
  });

  it('should handle API errors and set appropriate error message', () => {
    // Setup error response
    const errorResponse = new Error('API error');
    mockExchangeRateService.getExchangeRatesForWeek.and.returnValue(
      throwError(() => errorResponse)
    );

    // Clear previous state
    component.error.set(null);
    component.loading.set(false);

    // Call the method
    component.loadExchangeRates();

    // Verify error handling
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe(
      'Failed to load exchange rates. Please try again later.'
    );
    expect(component.exchangeRates()).toEqual([]);
    expect(
      mockExchangeRateService.getExchangeRatesForWeek
    ).toHaveBeenCalledWith(
      component.baseCurrency(),
      component.targetCurrencies(),
      component.endDate()
    );
  });

  it('should properly sort exchange rates by date in ascending order when sortRates is called', () => {
    // Arrange - create sample exchange rates with out-of-order dates
    const mockRates = [
      {
        date: new Date('2023-05-03'),
        baseCurrency: 'gbp',
        rates: { usd: 1.27, eur: 1.14 },
      },
      {
        date: new Date('2023-05-01'),
        baseCurrency: 'gbp',
        rates: { usd: 1.25, eur: 1.12 },
      },
      {
        date: new Date('2023-05-02'),
        baseCurrency: 'gbp',
        rates: { usd: 1.26, eur: 1.13 },
      },
    ];

    // Set the mock rates to the component
    component.exchangeRates.set(mockRates);

    // Act - call the sortRates method to sort by date in ascending order
    component.sortRates('date', 'asc');

    // Assert - verify the dates are sorted in ascending order
    const sortedRates = component.exchangeRates();
    expect(sortedRates.length).toBe(3);
    expect(sortedRates[0].date).toEqual(new Date('2023-05-01'));
    expect(sortedRates[1].date).toEqual(new Date('2023-05-02'));
    expect(sortedRates[2].date).toEqual(new Date('2023-05-03'));
  });

  it('should properly sort exchange rates by date in descending order when sortRates is called', () => {
    // Arrange - create sample exchange rates with out-of-order dates
    const mockRates = [
      {
        date: new Date('2023-05-03'),
        baseCurrency: 'gbp',
        rates: { usd: 1.27, eur: 1.14 },
      },
      {
        date: new Date('2023-05-01'),
        baseCurrency: 'gbp',
        rates: { usd: 1.25, eur: 1.12 },
      },
      {
        date: new Date('2023-05-02'),
        baseCurrency: 'gbp',
        rates: { usd: 1.26, eur: 1.13 },
      },
    ];

    // Set the mock rates to the component
    component.exchangeRates.set(mockRates);

    // Act - call the sortRates method to sort by date in descending order
    component.sortRates('date', 'desc');

    // Assert - verify the dates are sorted in descending order
    const sortedRates = component.exchangeRates();
    expect(sortedRates.length).toBe(3);
    expect(sortedRates[0].date).toEqual(new Date('2023-05-03'));
    expect(sortedRates[1].date).toEqual(new Date('2023-05-02'));
    expect(sortedRates[2].date).toEqual(new Date('2023-05-01'));
  });

  it('should properly sort exchange rates by a specific currency in ascending order when sortRates is called', () => {
    // Arrange - create sample exchange rates with different USD values
    const mockRates = [
      {
        date: new Date('2023-05-01'),
        baseCurrency: 'gbp',
        rates: { usd: 1.25, eur: 1.12 },
      },
      {
        date: new Date('2023-05-02'),
        baseCurrency: 'gbp',
        rates: { usd: 1.2, eur: 1.13 },
      },
      {
        date: new Date('2023-05-03'),
        baseCurrency: 'gbp',
        rates: { usd: 1.3, eur: 1.14 },
      },
    ];

    // Set the mock rates to the component
    component.exchangeRates.set(mockRates);

    // Act - call the sortRates method to sort by USD in ascending order
    component.sortRates('usd', 'asc');

    // Assert - verify the rates are sorted by USD value in ascending order
    const sortedRates = component.exchangeRates();
    expect(sortedRates.length).toBe(3);
    expect(sortedRates[0].rates['usd']).toBe(1.2);
    expect(sortedRates[1].rates['usd']).toBe(1.25);
    expect(sortedRates[2].rates['usd']).toBe(1.3);
  });

  it('should properly sort exchange rates by a specific currency in descending order when sortRates is called', () => {
    // Arrange - create sample exchange rates with different EUR values
    const mockRates = [
      {
        date: new Date('2023-05-01'),
        baseCurrency: 'gbp',
        rates: { usd: 1.25, eur: 1.12 },
      },
      {
        date: new Date('2023-05-02'),
        baseCurrency: 'gbp',
        rates: { usd: 1.26, eur: 1.18 },
      },
      {
        date: new Date('2023-05-03'),
        baseCurrency: 'gbp',
        rates: { usd: 1.27, eur: 1.15 },
      },
    ];

    // Set the mock rates to the component
    component.exchangeRates.set(mockRates);

    // Act - call the sortRates method to sort by EUR in descending order
    component.sortRates('eur', 'desc');

    // Assert - verify the rates are sorted by EUR value in descending order
    const sortedRates = component.exchangeRates();
    expect(sortedRates.length).toBe(3);
    expect(sortedRates[0].rates['eur']).toBe(1.18);
    expect(sortedRates[1].rates['eur']).toBe(1.15);
    expect(sortedRates[2].rates['eur']).toBe(1.12);
  });
});
