import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Currency } from '../models/currency.model';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private http = inject(HttpClient);
  private currenciesUrl =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

  getCurrencies(): Observable<Currency[]> {
    return this.http
      .get<Record<string, string>>(this.currenciesUrl)
      .pipe(
        map((dict) =>
          Object.entries(dict).map(([code, name]) => ({ code, name }))
        )
      );
  }
}
