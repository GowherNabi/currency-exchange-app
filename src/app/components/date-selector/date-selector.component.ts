import { Component, output, input } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.scss',
})
export class DateSelectorComponent {
  selectedDate = input<Date>(new Date());
  selectedDateChange = output<Date>();

  get maxDate(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  get minDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 90);
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Emit new Date object to parent component
    this.selectedDateChange.emit(new Date(input.value));
  }
}
