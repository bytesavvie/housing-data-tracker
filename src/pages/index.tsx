// React
import { useState } from "react";

// Next
import { type NextPage } from "next";
import Head from "next/head";

// axios
import axios from "axios";

// react-select-search
import SelectSearch, {
  type SelectedOptionValue,
  type SelectedOption,
} from "react-select-search";

// components
import MonthlyInventoryChart from "~/components/charts/MonthlyInventoryChart";
import PercentBarChart from "~/components/charts/PercentBarChart";

// utils
import { formatMonthlyDate, decimalToPercent } from "../utils/statePage";
import { csvToArray } from "~/utils";
import { changeOverTimeMetrics } from "~/components/ui/ChartDataSection";

// Types
import type {
  MonthlyInventoryChartDataPoint,
  ChangeOverTimeChartDataPoint,
} from "~/customTypes";

interface IProps {
  usInventoryData: MonthlyInventoryChartDataPoint[];
  usChangeOverTimeData: ChangeOverTimeChartDataPoint[];
}

const Home: NextPage<IProps> = ({ usInventoryData, usChangeOverTimeData }) => {
  const [selectedUSMetric, setSelectedUSMetric] = useState<SelectedOption>({
    index: 1,
    name: "Median Listing Price (Y/Y)",
    value: "medianListingPriceYY",
  });

  const handleMetricSelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[]
  ) => {
    if (!Array.isArray(selectedOption)) {
      setSelectedUSMetric(selectedOption);
    }
  };

  return (
    <>
      <Head>
        <title>US Housing Market - National Data</title>
        <meta
          name="description"
          content="Data and charts showing different United States Housing Market metrics."
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main className="dark container mx-auto min-h-screen px-2 pb-12 sm:px-4">
        <h1 className="mt-16 mb-4 text-center text-4xl font-extrabold leading-normal text-white md:text-[5rem]">
          US Housing Data
        </h1>
        <section className="mb-16">
          <h2 className="mb-4 text-center text-3xl text-white">
            Monthly Inventory Data
          </h2>
          <p className="m-auto mb-6 max-w-xl text-center text-slate-400">
            The data below shows the values for different housing metrics in the
            United States. Click on the buttons below to view different metrics
            in the chart. Data is provided by{" "}
            <a
              href="https://www.realtor.com/research/data/"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              relator.com
            </a>
          </p>
          <div className="overflow-hidden">
            <MonthlyInventoryChart chartData={usInventoryData} />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-center text-3xl text-white">
            Trends Over Time
          </h2>
          <p className="m-auto mb-6 max-w-xl text-center text-slate-400">
            The data in this section shows the rate of change of different
            housing metrics over time. These metrics can be view on a year over
            year basis or month over month basis. Values are represented as
            percents (ex. Listing prices may be 10% higher this month on a year
            over year basis). Data is provided by{" "}
            <a
              href="https://www.realtor.com/research/data/"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              relator.com
            </a>
          </p>
          <div className="m-auto mb-8 max-w-md">
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
              value={selectedUSMetric.value as string}
              onChange={(selectedValue, selectedOption) =>
                handleMetricSelect(selectedValue, selectedOption)
              }
            />
          </div>
          <PercentBarChart
            containerClasses="h-[300px] w-full sm:h-[400px] md:h-[500px]"
            chartData={usChangeOverTimeData}
            dataKey={
              selectedUSMetric.value as keyof ChangeOverTimeChartDataPoint
            }
            barName={selectedUSMetric.name}
            barColor="#34d399"
          />
        </section>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const { data } = await axios.get<string>(
    "https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_Country_History.csv"
  );

  const usDataArray = csvToArray(data);
  const usInventoryData: MonthlyInventoryChartDataPoint[] = [];
  const usChangeOverTimeData: ChangeOverTimeChartDataPoint[] = [];

  for (let i = usDataArray.length - 3; i > 0; i--) {
    const row = usDataArray[i];

    if (row) {
      usInventoryData.push({
        date: formatMonthlyDate(row[0] || ""), // date
        medianListingPrice: Number(row[2]),
        medianDaysOnMarket: Number(row[8]),
        newListingCount: Number(row[11]),
        totalListingCount: Number(row[32]),
        priceReduced: Number(row[17]),
        squareFeet: Number(row[26]),
      });
    }

    // check to make sure percent over time changes are included
    if (row && row[4]) {
      usChangeOverTimeData.push({
        date: formatMonthlyDate(row[0] || ""),
        medianListingPriceMM: decimalToPercent(row[3] || ""),
        medianListingPriceYY: decimalToPercent(row[4] || ""),
        activeListingCountMM: decimalToPercent(row[6] || ""),
        activeListingCountYY: decimalToPercent(row[7] || ""),
        medianDaysOnMarketMM: decimalToPercent(row[9] || ""),
        medianDaysOnMarketYY: decimalToPercent(row[10] || ""),
        newListingCountMM: decimalToPercent(row[12] || ""),
        newListingCountYY: decimalToPercent(row[13] || ""),
        priceIncreasedCountMM: decimalToPercent(row[15] || ""),
        priceIncreasedCountYY: decimalToPercent(row[16] || ""),
        priceReducedCountMM: decimalToPercent(row[18] || ""),
        priceReducedCountYY: decimalToPercent(row[19] || ""),
        pendingListingCountMM: decimalToPercent(row[21] || ""),
        pendingListingCountYY: decimalToPercent(row[22] || ""),
        medianListingPricePerSquareFootMM: decimalToPercent(row[24] || ""),
        medianListingPricePerSquareFootYY: decimalToPercent(row[25] || ""),
        medianSquareFeetMM: decimalToPercent(row[27] || ""),
        medianSquareFeetYY: decimalToPercent(row[28] || ""),
        averageListingPriceMM: decimalToPercent(row[30] || ""),
        averageListingPriceYY: decimalToPercent(row[31] || ""),
        totalListingCountMM: decimalToPercent(row[33] || ""),
        totalListingCountYY: decimalToPercent(row[34] || ""),
        pendingRatioMM: decimalToPercent(row[36] || ""),
        pendingRatioYY: decimalToPercent(row[37] || ""),
      });
    }
  }

  return {
    props: {
      usInventoryData: usInventoryData,
      usChangeOverTimeData: usChangeOverTimeData,
    },
    revalidate: 60 * 60 * 24, // Revalidate once every day
  };
};
