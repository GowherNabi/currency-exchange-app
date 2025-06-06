import { Component, input, output } from '@angular/core';
import { ExchangeRate } from '../../models/exchange-rate.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-rates-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-rates-table.component.html',
  styleUrls: ['./exchange-rates-table.component.scss'],
})
export class ExchangeRatesTableComponent {
  exchangeRates = input<ExchangeRate[]>([]);
  targetCurrencies = input<string[]>([]);

  // Track sorting state
  currentSortColumn: string | null = 'date';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  // Output for sort events
  sortChange = output<{ column: string; direction: 'asc' | 'desc' }>();

  getRate(rate: ExchangeRate, currency: string): number | null {
    return rate.rates[currency.toLowerCase()] ?? null;
  }

  // Handle sort column click
  onSort(column: string): void {
    if (this.currentSortColumn === column) {
      // Toggle direction if same column clicked
      this.currentSortDirection =
        this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }

    // Emit the sort event to parent
    this.sortChange.emit({
      column: this.currentSortColumn,
      direction: this.currentSortDirection,
    });
  }

  // Get the appropriate sort icon for a column
  getSortIcon(column: string): string {
    if (this.currentSortColumn !== column) return '↕'; // Neutral icon
    return this.currentSortDirection === 'asc' ? '↑' : '↓';
  }
}
