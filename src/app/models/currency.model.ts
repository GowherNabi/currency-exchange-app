export interface Currency {
  code: string;
  name: string;
}

export interface ExchangeRateResponse {
  date: string;
  [currency: string]: unknown; // Can be number or nested object depending on API version
}
