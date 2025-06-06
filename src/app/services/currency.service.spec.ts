import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch currencies', () => {
    const mockResponse = { usd: 'US Dollar', eur: 'Euro' };

    service.getCurrencies().subscribe((currencies) => {
      expect(currencies.length).toBe(2);
      expect(currencies[0].code).toBe('usd');
    });

    const req = httpMock.expectOne(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty response by returning an empty array', () => {
    const mockResponse = {};

    service.getCurrencies().subscribe((currencies) => {
      expect(currencies).toBeInstanceOf(Array);
      expect(currencies.length).toBe(0);
    });

    const req = httpMock.expectOne(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should correctly map all currencies when a larger response is returned', () => {
    const mockResponse = {
      usd: 'US Dollar',
      eur: 'Euro',
      gbp: 'British Pound',
      jpy: 'Japanese Yen',
      cad: 'Canadian Dollar',
    };

    service.getCurrencies().subscribe((currencies) => {
      expect(currencies.length).toBe(5);
      expect(currencies).toEqual([
        { code: 'usd', name: 'US Dollar' },
        { code: 'eur', name: 'Euro' },
        { code: 'gbp', name: 'British Pound' },
        { code: 'jpy', name: 'Japanese Yen' },
        { code: 'cad', name: 'Canadian Dollar' },
      ]);
    });

    const req = httpMock.expectOne(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
