import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExchangeRateService],
    });
    service = TestBed.inject(ExchangeRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch exchange rates for week', () => {
    const baseCurrency = 'gbp';
    const targetCurrencies = ['usd', 'eur'];
    const endDate = new Date('2025-01-01');

    service
      .getExchangeRatesForWeek(baseCurrency, targetCurrencies, endDate)
      .subscribe();

    // Verify 7 requests (one for each day)
    const requests = httpMock.match((req) =>
      req.url.includes('/currencies/gbp.json')
    );
    expect(requests.length).toBe(7);
  });
});
