import { Component, OnInit, output, input } from '@angular/core';
import { Currency } from '../../models/currency.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss',
})
export class CurrencySelectorComponent implements OnInit {
  selectedCurrencies = input<string[]>([]);
  baseCurrency = input<string>('GBP');
  // Output event emitters (notify parent of changes)
  baseCurrencyChange = output<string>();
  selectedCurrenciesChange = output<string[]>();

  allCurrencies: Currency[] = [];
  availableCurrencies: Currency[] = [];
  newCurrency = '';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // Fetch all available currencies from service
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.allCurrencies = currencies;
      // Update list of available currencies (excluding already selected ones)
      this.updateAvailableCurrencies();
    });
  }

  onBaseCurrencyChange(newBaseCurrency: string): void {
    this.baseCurrencyChange.emit(newBaseCurrency);
  }

  onAddCurrency(): void {
    if (
      this.newCurrency &&
      !this.selectedCurrencies().includes(this.newCurrency)
    ) {
      // Create new array with added currency (immutable update)
      const updatedCurrencies = [
        ...this.selectedCurrencies(),
        this.newCurrency,
      ];
      this.selectedCurrenciesChange.emit(updatedCurrencies);
      this.newCurrency = '';
      // Update available currencies list
      this.updateAvailableCurrencies();
    }
  }

  onRemoveCurrency(currencyToRemove: string): void {
    // Filter out the removed currency
    const updatedCurrencies = this.selectedCurrencies().filter(
      (c) => c !== currencyToRemove
    );
    // Only update if we maintain minimum of 3 currencies
    if (updatedCurrencies.length >= 3) {
      this.selectedCurrenciesChange.emit(updatedCurrencies);
      this.updateAvailableCurrencies();
    }
  }

  updateAvailableCurrencies(): void {
    this.availableCurrencies = this.allCurrencies.filter(
      (currency) =>
        !this.selectedCurrencies().includes(currency.code) &&
        currency.code !== this.baseCurrency()
    );
  }
}
