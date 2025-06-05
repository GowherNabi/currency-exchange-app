import { Component, input } from '@angular/core';
import { ExchangeRate } from '../../models/exchange-rate.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-rates-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-rates-table.component.html',
  styleUrl: './exchange-rates-table.component.scss',
})
export class ExchangeRatesTableComponent {
  exchangeRates = input<ExchangeRate[]>([]);
  targetCurrencies = input<string[]>([]);

  getRate(rate: ExchangeRate, currency: string): number | null {
    return rate.rates[currency.toLowerCase()] ?? null;
  }
}
