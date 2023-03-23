export interface State {
  id: string;
  val: string;
  fullName: string;
}

export interface StateDataPoint {
  date: string;
  medianListingPrice: string;
}

export interface MonthlyInventoryChartDataPoint {
  date: string; // date
  medianListingPrice: number;
  medianDaysOnMarket: number;
  newListingCount: number;
  totalListingCount: number;
  priceReduced: number;
  squareFeet: number;
}

export interface DisplayedChartData {
  listingPrice: boolean;
  totalListings: boolean;
  newListings: boolean;
  priceReduced: boolean;
  daysOnMarket: boolean;
  squareFeet: boolean;
}

export interface SelectSearchOption {
  name: string;
  value: string;
}
