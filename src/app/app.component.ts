import { Component, signal } from '@angular/core';
import { ExchangeRate } from './models/exchange-rate.model';
import { ExchangeRateService } from './services/exchange-rate.service';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { ExchangeRatesTableComponent } from './components/exchange-rates-table/exchange-rates-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencySelectorComponent,
    DateSelectorComponent,
    ExchangeRatesTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Currency Exchange Rates';
  baseCurrency = signal('gbp');
  targetCurrencies = signal(['usd', 'eur', 'jpy', 'chf', 'cad', 'aud', 'zar']);
  endDate = signal(new Date());
  exchangeRates = signal<ExchangeRate[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private exchangeRateService: ExchangeRateService) {
    // Load default exchange rates when component initializes
    this.loadExchangeRates();
  }

  onBaseCurrencyChange(newBaseCurrency: string): void {
    // Update base currency
    this.baseCurrency.set(newBaseCurrency.toLowerCase());
    // Reload data with new base currency
    this.loadExchangeRates();
  }

  onSelectedCurrenciesChange(newCurrencies: string[]): void {
    // Update target currencies
    this.targetCurrencies.set(newCurrencies.map((c) => c.toLowerCase()));
    // Reload data with new currency set
    this.loadExchangeRates();
  }

  onDateChange(newDate: Date): void {
    // Update the end date
    this.endDate.set(newDate);
    // Reload data for new date range
    this.loadExchangeRates();
  }

  private loadExchangeRates(): void {
    this.loading.set(true);
    this.error.set(null);
    this.exchangeRates.set([]);
    // Call the service to get exchange rates
    this.exchangeRateService
      .getExchangeRatesForWeek(
        this.baseCurrency(),
        this.targetCurrencies(),
        this.endDate()
      )
      .subscribe({
        next: (rates) => {
          if (rates.length === 0) {
            this.error.set('No data available for the selected date range');
          } else {
            // Update with new rates
            this.exchangeRates.set(rates);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading exchange rates:', err);
          this.error.set(
            'Failed to load exchange rates. Please try again later.'
          );
          this.loading.set(false);
        },
      });
  }
}
