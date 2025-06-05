import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import {
  ExchangeRate,
  ExchangeRateApiResponse,
} from '../models/exchange-rate.model';
import { formatDate } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private http = inject(HttpClient);
  private baseUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

  getExchangeRatesForWeek(
    baseCurrency: string,
    targetCurrencies: string[],
    endDate: Date
  ): Observable<ExchangeRate[]> {
    const requests: Observable<ExchangeRate | null>[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      requests.push(this.getExchangeRate(baseCurrency, targetCurrencies, date));
    }

    return forkJoin(requests).pipe(
      map((responses) => {
        // Filter out null responses and cast to ExchangeRate[]
        const validRates = responses.filter(
          (rate): rate is ExchangeRate => rate !== null
        );
        return validRates.sort((a, b) => a.date.getTime() - b.date.getTime());
      })
    );
  }

  private getExchangeRate(
    baseCurrency: string,
    targetCurrencies: string[],
    date: Date
  ): Observable<ExchangeRate | null> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    const url = `${
      this.baseUrl
    }@${formattedDate}/v1/currencies/${baseCurrency.toLowerCase()}.json`;

    return this.http.get<ExchangeRateApiResponse>(url).pipe(
      map((response) => {
        const baseCurrencyKey = baseCurrency.toLowerCase();
        const ratesData = response[baseCurrencyKey];

        if (typeof ratesData === 'object' && ratesData !== null) {
          const rates: { [currency: string]: number } = {};

          targetCurrencies.forEach((targetCurrency) => {
            const rate = ratesData[targetCurrency.toLowerCase()];
            if (rate !== undefined) {
              rates[targetCurrency.toLowerCase()] = rate;
            }
          });

          return {
            date: new Date(response.date),
            baseCurrency,
            rates,
          };
        }
        throw new Error('Invalid response format');
      }),
      catchError((error) => {
        console.warn(
          `Failed to load rates for ${baseCurrency} on ${formattedDate}`,
          error
        );
        return of(null);
      })
    );
  }
}
