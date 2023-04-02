export interface State {
  id: string;
  val: string;
  fullName: string;
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

export interface ChangeOverTimeChartDataPoint {
  date: string;
  medianListingPriceMM: number;
  medianListingPriceYY: number;
  activeListingCountMM: number;
  activeListingCountYY: number;
  medianDaysOnMarketMM: number;
  medianDaysOnMarketYY: number;
  newListingCountMM: number;
  newListingCountYY: number;
  priceIncreasedCountMM: number;
  priceIncreasedCountYY: number;
  priceReducedCountMM: number;
  priceReducedCountYY: number;
  pendingListingCountMM: number;
  pendingListingCountYY: number;
  medianListingPricePerSquareFootMM: number;
  medianListingPricePerSquareFootYY: number;
  medianSquareFeetMM: number;
  medianSquareFeetYY: number;
  averageListingPriceMM: number;
  averageListingPriceYY: number;
  totalListingCountMM: number;
  totalListingCountYY: number;
  pendingRatioMM: number;
  pendingRatioYY: number;
}

export interface dataApiResponse {
  inventoryData: MonthlyInventoryChartDataPoint[];
  changeOverTimeData: ChangeOverTimeChartDataPoint[];
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
