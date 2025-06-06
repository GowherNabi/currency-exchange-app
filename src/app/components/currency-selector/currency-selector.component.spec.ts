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
});
