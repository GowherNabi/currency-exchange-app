import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencySelectorComponent } from './currency-selector.component';
import { CurrencyService } from '../../services/currency.service';
import { of } from 'rxjs';

describe('CurrencySelectorComponent', () => {
  let component: CurrencySelectorComponent;
  let fixture: ComponentFixture<CurrencySelectorComponent>;
  let mockCurrencyService: jasmine.SpyObj<CurrencyService>;

  beforeEach(async () => {
    mockCurrencyService = jasmine.createSpyObj('CurrencyService', [
      'getCurrencies',
    ]);
    mockCurrencyService.getCurrencies.and.returnValue(
      of([
        { code: 'usd', name: 'US Dollar' },
        { code: 'eur', name: 'Euro' },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [CurrencySelectorComponent],
      providers: [{ provide: CurrencyService, useValue: mockCurrencyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load currencies on init', () => {
    expect(mockCurrencyService.getCurrencies).toHaveBeenCalled();
    expect(component.allCurrencies.length).toBe(2);
  });

  it('should emit base currency change', () => {
    spyOn(component.baseCurrencyChange, 'emit');
    component.onBaseCurrencyChange('eur');
    expect(component.baseCurrencyChange.emit).toHaveBeenCalledWith('eur');
  });

  it('should properly initialize default values when component is created', () => {
    // Verify input properties initialized with default values
    expect(component.baseCurrency()).toBe('GBP');
    expect(component.selectedCurrencies()).toEqual([]);

    // Verify component properties initialized correctly
    expect(component.allCurrencies.length).toBe(2); // From mock service
    expect(component.newCurrency).toBe('');

    // Verify available currencies are properly filtered
    expect(component.availableCurrencies.length).toBe(2);
    expect(component.availableCurrencies).toEqual([
      { code: 'usd', name: 'US Dollar' },
      { code: 'eur', name: 'Euro' },
    ]);

    // Verify updateAvailableCurrencies was called during initialization
    expect(mockCurrencyService.getCurrencies).toHaveBeenCalledTimes(1);
  });

  it("should not add a currency if it's already in the selected currencies list", () => {
    // Arrange
    spyOn(component.selectedCurrenciesChange, 'emit');
    const initialSelectedCurrencies = ['usd', 'eur', 'jpy'];

    // Mock the selectedCurrencies input
    Object.defineProperty(component, 'selectedCurrencies', {
      value: () => initialSelectedCurrencies,
    });

    // Set the new currency to one that's already in the list
    component.newCurrency = 'usd';

    // Act
    component.onAddCurrency();

    // Assert
    expect(component.selectedCurrenciesChange.emit).not.toHaveBeenCalled();
    expect(component.newCurrency).toBe('usd'); // Value shouldn't be reset
  });

  it('should clear the newCurrency field after successfully adding a currency', () => {
    // Arrange
    spyOn(component.selectedCurrenciesChange, 'emit');
    spyOn(component, 'updateAvailableCurrencies');
    component.newCurrency = 'jpy';
    const initialSelectedCurrencies = ['usd', 'eur'];

    // Mock the selectedCurrencies input
    Object.defineProperty(component, 'selectedCurrencies', {
      value: () => initialSelectedCurrencies,
    });

    // Act
    component.onAddCurrency();

    // Assert
    expect(component.selectedCurrenciesChange.emit).toHaveBeenCalledWith([
      'usd',
      'eur',
      'jpy',
    ]);
    expect(component.newCurrency).toBe('');
    expect(component.updateAvailableCurrencies).toHaveBeenCalled();
  });
});
