export interface ExchangeRate {
  date: Date;
  baseCurrency: string;
  rates: { [currency: string]: number };
}

export interface ExchangeRateApiResponse {
  date: string;
  [baseCurrency: string]: { [targetCurrency: string]: number } | string;
}
