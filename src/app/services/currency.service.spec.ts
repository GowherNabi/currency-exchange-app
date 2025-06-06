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
});
