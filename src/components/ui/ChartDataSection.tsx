// React
import type { FC } from "react";

// react-select-search
import SelectSearch, {
  type SelectedOptionValue,
  type SelectedOption,
  type SelectSearchProps,
} from "react-select-search";

// react-device-detect
import { isMobile } from "react-device-detect";

// Components
import MonthlyInventoryChart from "../charts/MonthlyInventoryChart";
import MobileMonthlyInventoryChart from "../charts/MobileMonthlyInventoryChartData";
import PercentBarChart from "../charts/PercentBarChart";

// Custom Types
import type {
  MonthlyInventoryChartDataPoint,
  ChangeOverTimeChartDataPoint,
} from "../../customTypes";

export const changeOverTimeMetrics: {
  value: keyof ChangeOverTimeChartDataPoint;
  name: string;
}[] = [
  { value: "medianListingPriceMM", name: "Median Listing Price (M/M)" },
  { value: "medianListingPriceYY", name: "Median Listing Price (Y/Y)" },
  { value: "activeListingCountMM", name: "Active Listing Count (M/M)" },
  { value: "activeListingCountYY", name: "Active Listing Count (Y/Y)" },
  { value: "medianDaysOnMarketMM", name: "Median Days On Market (M/M)" },
  { value: "medianDaysOnMarketYY", name: "Median Days On Market (Y/Y)" },
  { value: "newListingCountMM", name: "New Listing Count (M/M)" },
  { value: "newListingCountYY", name: "New Listing Count (Y/Y)" },
  { value: "priceIncreasedCountMM", name: "Price Increased Count (M/M)" },
  { value: "priceIncreasedCountYY", name: "Price Increased Count (Y/Y)" },
  { value: "priceReducedCountMM", name: "Price Reduced Count (M/M)" },
  { value: "priceReducedCountYY", name: "Price Reduced Count (Y/Y)" },
  { value: "pendingListingCountMM", name: "Pending Listing Count (M/M)" },
  { value: "pendingListingCountYY", name: "Pending Listing Count (Y/Y)" },
  {
    value: "medianListingPricePerSquareFootMM",
    name: "Median Listing Price Per Sqft (M/M)",
  },
  {
    value: "medianListingPricePerSquareFootYY",
    name: "Median Listing Price Per Sqft  (Y/Y)",
  },
  { value: "medianSquareFeetMM", name: "Median Sqft (M/M)" },
  { value: "medianSquareFeetYY", name: "Median Sqft (Y/Y)" },
  { value: "averageListingPriceMM", name: "Average Listing Price (M/M)" },
  { value: "averageListingPriceYY", name: "Average Listing Price (Y/Y)" },
  { value: "totalListingCountMM", name: "Total Lisiting Count (M/M)" },
  { value: "totalListingCountYY", name: "Total Lisiting Count (Y/Y)" },
  { value: "pendingRatioMM", name: "Pending Ratio (M/M)" },
  { value: "pendingRatioYY", name: "Pending Ratio (Y/Y)" },
];

interface IProps {
  inventoryDataTitle: string;
  trendOverTimeTitle: string;
  inventoryData: MonthlyInventoryChartDataPoint[];
  changeOverTimeData: ChangeOverTimeChartDataPoint[];
  selectedMetric: SelectedOption;
  handleMetricChange: (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[],
    optionSnapShot: SelectSearchProps
  ) => void;
}

const ChartDataSection: FC<IProps> = ({
  inventoryDataTitle,
  trendOverTimeTitle,
  inventoryData,
  changeOverTimeData,
  selectedMetric,
  handleMetricChange,
}) => {
  return (
    <>
      <section className="mb-16">
        <h2 className="mb-4 text-center text-3xl text-white">
          {inventoryDataTitle}
        </h2>
        {isMobile ? (
          <MobileMonthlyInventoryChart chartData={inventoryData} />
        ) : (
          <MonthlyInventoryChart chartData={inventoryData} />
        )}
      </section>
      <section>
        <h2 className="mb-4 text-center text-3xl text-white">
          {trendOverTimeTitle}
        </h2>
        <div className="m-auto mb-16 max-w-md">
          <label
            htmlFor="county"
            className="mb-2 block text-sm font-medium text-white"
          >
            Metric
          </label>
          <SelectSearch
            options={changeOverTimeMetrics}
            placeholder="Select Metric"
            search
            value={selectedMetric.value as string}
            onChange={handleMetricChange}
          />
        </div>
        <PercentBarChart
          containerClasses="lg:h-[450px] h-[400px]"
          chartData={changeOverTimeData}
          dataKey={selectedMetric.value as keyof ChangeOverTimeChartDataPoint}
          barName={selectedMetric.name}
          barColor="#34d399"
        />
      </section>
    </>
  );
};

export default ChartDataSection;
