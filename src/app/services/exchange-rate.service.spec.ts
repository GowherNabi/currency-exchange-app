import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../models/exchange-rate.model';

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

  it('should properly filter out null responses from the weekly exchange rates', () => {
    const baseCurrency = 'gbp';
    const targetCurrencies = ['usd', 'eur'];
    const endDate = new Date('2023-05-07');

    // Mock data for days when API returns valid responses
    const mockResponseDay1 = {
      date: '2023-05-01',
      gbp: { usd: 1.25, eur: 1.12 },
    };

    const mockResponseDay3 = {
      date: '2023-05-03',
      gbp: { usd: 1.27, eur: 1.14 },
    };

    const mockResponseDay7 = {
      date: '2023-05-07',
      gbp: { usd: 1.28, eur: 1.15 },
    };

    let result: ExchangeRate[] | undefined;

    // Call the service method
    service
      .getExchangeRatesForWeek(baseCurrency, targetCurrencies, endDate)
      .subscribe((data) => {
        result = data;
      });

    // Get all the HTTP requests
    const requests = httpMock.match((req) =>
      req.url.includes('/currencies/gbp.json')
    );
    expect(requests.length).toBe(7);

    // Respond to requests - some with valid data, some with errors
    requests[0].flush(mockResponseDay1); // May 1
    requests[1].error(new ErrorEvent('Network error')); // May 2
    requests[2].flush(mockResponseDay3); // May 3
    requests[3].error(new ErrorEvent('Network error')); // May 4
    requests[4].error(new ErrorEvent('Network error')); // May 5
    requests[5].error(new ErrorEvent('Network error')); // May 6
    requests[6].flush(mockResponseDay7); // May 7

    // Verify only the valid responses are included
    expect(result?.length).toBe(3);

    // Verify the dates of the successful responses
    expect(result?.[0].date).toEqual(new Date('2023-05-01'));
    expect(result?.[1].date).toEqual(new Date('2023-05-03'));
    expect(result?.[2].date).toEqual(new Date('2023-05-07'));

    // Verify the rates
    expect(result?.[0].rates['usd']).toBe(1.25);
    expect(result?.[1].rates['eur']).toBe(1.14);
    expect(result?.[2].rates['usd']).toBe(1.28);
  });

  it('should sort the valid exchange rate responses by date', () => {
    const baseCurrency = 'gbp';
    const targetCurrencies = ['usd', 'eur'];
    const endDate = new Date('2023-05-07');

    // Mock data with out-of-order dates
    const mockResponseDay7 = {
      date: '2023-05-07',
      gbp: { usd: 1.28, eur: 1.15 },
    };

    const mockResponseDay1 = {
      date: '2023-05-01',
      gbp: { usd: 1.25, eur: 1.12 },
    };

    const mockResponseDay4 = {
      date: '2023-05-04',
      gbp: { usd: 1.27, eur: 1.14 },
    };

    let result: ExchangeRate[] | undefined;

    // Call the service method
    service
      .getExchangeRatesForWeek(baseCurrency, targetCurrencies, endDate)
      .subscribe((data) => {
        result = data;
      });

    // Get all the HTTP requests
    const requests = httpMock.match((req) =>
      req.url.includes('/currencies/gbp.json')
    );

    // Deliberately respond to requests in a non-chronological order
    requests[6].flush(mockResponseDay7); // May 7 (latest)
    requests[3].flush(mockResponseDay4); // May 4 (middle)
    requests[0].flush(mockResponseDay1); // May 1 (earliest)

    // Respond with errors to the other requests
    requests[1].error(new ErrorEvent('Network error'));
    requests[2].error(new ErrorEvent('Network error'));
    requests[4].error(new ErrorEvent('Network error'));
    requests[5].error(new ErrorEvent('Network error'));

    // Verify we have 3 results
    expect(result?.length).toBe(3);

    // Verify the results are sorted by date (ascending)
    expect(result?.[0].date).toEqual(new Date('2023-05-01'));
    expect(result?.[1].date).toEqual(new Date('2023-05-04'));
    expect(result?.[2].date).toEqual(new Date('2023-05-07'));
  });
});
