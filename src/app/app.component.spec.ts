import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ExchangeRateService } from './services/exchange-rate.service';
import { of } from 'rxjs';

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
      imports: [AppComponent],
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
});
