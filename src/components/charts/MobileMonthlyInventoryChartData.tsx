// React
import React, { useState, type FC } from "react";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Types
import { type MonthlyInventoryChartDataPoint } from "~/customTypes";

interface IProps {
  chartData: MonthlyInventoryChartDataPoint[];
}
const activeBtnCSS =
  "text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2";

const nonActiveBtnCSS =
  "border focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800";

type chartDataKey = keyof MonthlyInventoryChartDataPoint;

const MobileMonthlyInventoryChart: FC<IProps> = ({ chartData }) => {
  const [displayedChartData, setDisplayedChartData] =
    useState<chartDataKey>("medianListingPrice");

  const handleChartButtonClick = (key: chartDataKey) => {
    setDisplayedChartData(key);
  };

  return (
    <div>
      <div className="mb-4 h-[300px] w-full sm:h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              style={{ fill: "#f3f4f6" }}
              height={50}
              minTickGap={10}
              tickSize={10}
            />

            <YAxis
              yAxisId="price"
              hide={displayedChartData !== "medianListingPrice"}
              domain={["auto", "auto"]}
              style={{ fill: "#f3f4f6" }}
              tickFormatter={(value: number) => {
                if (value >= 1000000) {
                  return `$${value / 1000000}M`;
                }
                if (value >= 1000) {
                  return `$${value / 1000}K`;
                }

                return `$${value}`;
              }}
            />

            <YAxis
              yAxisId="listings"
              hide={
                displayedChartData !== "newListingCount" &&
                displayedChartData !== "totalListingCount"
              }
              style={{ fill: "#f3f4f6" }}
              tickFormatter={(value: number) => {
                if (value >= 1000000) {
                  return `${value / 1000000}M`;
                }
                if (value >= 1000) {
                  return `${value / 1000}K`;
                }

                return `${value}`;
              }}
            />

            <YAxis
              yAxisId="feet"
              unit="ft"
              style={{ fill: "#f3f4f6" }}
              hide={displayedChartData !== "squareFeet"}
            />

            <YAxis
              yAxisId="days"
              style={{ fill: "#f3f4f6" }}
              width={80}
              unit="days"
              hide={displayedChartData !== "medianDaysOnMarket"}
            />

            <Tooltip
              formatter={(value: string | number, name) => {
                let result = value.toLocaleString("en-us");
                if (name === "Listing Price") result = `$${result}`;

                return result;
              }}
              contentStyle={{
                background: "rgba(0, 0, 0, 0.9)",
                color: "white",
                borderRadius: "5px",
                border: "1px solid black",
              }}
            />
            <Legend />
            {displayedChartData === "medianListingPrice" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="medianListingPrice"
                stroke="#34d399"
                yAxisId="price"
                name="Median List Price"
                dot={false}
              />
            )}
            {displayedChartData === "totalListingCount" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="totalListingCount"
                stroke="#22d3ee"
                yAxisId="listings"
                name="Total Listings"
                dot={false}
              />
            )}
            {displayedChartData === "newListingCount" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="newListingCount"
                stroke="#60a5fa"
                yAxisId="listings"
                name="New Listings"
                dot={false}
              />
            )}
            {displayedChartData === "priceReduced" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="priceReduced"
                stroke="#a78bfa"
                yAxisId="listings"
                name="Price Reduced"
                dot={false}
              />
            )}
            {displayedChartData === "medianDaysOnMarket" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="medianDaysOnMarket"
                stroke="#fbbf24"
                yAxisId="days"
                name="Days On Market"
                dot={false}
              />
            )}
            {displayedChartData === "squareFeet" && (
              <Line
                strokeWidth={4}
                type="monotone"
                dataKey="squareFeet"
                stroke="#f43f5e"
                yAxisId="feet"
                name="Square Feet"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <button
          className={
            displayedChartData === "medianListingPrice"
              ? activeBtnCSS
              : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("medianListingPrice")}
        >
          Median List Price
        </button>
        <button
          className={
            displayedChartData === "totalListingCount"
              ? activeBtnCSS
              : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("totalListingCount")}
        >
          Total Listing
        </button>
        <button
          className={
            displayedChartData === "newListingCount"
              ? activeBtnCSS
              : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("newListingCount")}
        >
          New Listings
        </button>
        <button
          className={
            displayedChartData === "priceReduced"
              ? activeBtnCSS
              : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("priceReduced")}
        >
          Price Reduced
        </button>
        <button
          className={
            displayedChartData === "medianDaysOnMarket"
              ? activeBtnCSS
              : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("medianDaysOnMarket")}
        >
          Days on Market
        </button>
        <button
          className={
            displayedChartData === "squareFeet" ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("squareFeet")}
        >
          Square Feet
        </button>
      </div>
    </div>
  );
};

export default MobileMonthlyInventoryChart;
