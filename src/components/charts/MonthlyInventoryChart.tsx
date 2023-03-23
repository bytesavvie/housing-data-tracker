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
import {
  type MonthlyInventoryChartDataPoint,
  type DisplayedChartData,
} from "~/customTypes";

interface IProps {
  chartData: MonthlyInventoryChartDataPoint[];
}
const activeBtnCSS =
  "text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2";

const nonActiveBtnCSS =
  "border focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800";

const MonthlyInventoryChart: FC<IProps> = ({ chartData }) => {
  const [displayedChartData, setDisplayedChartData] =
    useState<DisplayedChartData>({
      listingPrice: true,
      totalListings: false,
      newListings: false,
      priceReduced: false,
      daysOnMarket: false,
      squareFeet: false,
    });

  const handleChartButtonClick = (key: keyof DisplayedChartData) => {
    setDisplayedChartData((previousState) => ({
      ...previousState,
      [key]: !previousState[key],
    }));
  };

  const hideListingsYAxis = () => {
    if (
      displayedChartData.totalListings ||
      displayedChartData.newListings ||
      displayedChartData.priceReduced
    ) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <div style={{ height: 500, width: "100%" }} className="mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={{ fill: "#f3f4f6" }} />

            <YAxis
              yAxisId="price"
              hide={!displayedChartData.listingPrice}
              width={65}
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
              hide={hideListingsYAxis()}
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
              orientation="right"
              style={{ fill: "#f3f4f6" }}
              width={65}
              hide={!displayedChartData.squareFeet}
            />

            <YAxis
              yAxisId="days"
              orientation="right"
              style={{ fill: "#f3f4f6" }}
              unit="days"
              hide={!displayedChartData.daysOnMarket}
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
            {displayedChartData.listingPrice && (
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
            {displayedChartData.totalListings && (
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
            {displayedChartData.newListings && (
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
            {displayedChartData.priceReduced && (
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
            {displayedChartData.daysOnMarket && (
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
            {displayedChartData.squareFeet && (
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
            displayedChartData.listingPrice ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("listingPrice")}
        >
          Median List Price
        </button>
        <button
          className={
            displayedChartData.totalListings ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("totalListings")}
        >
          Total Listing
        </button>
        <button
          className={
            displayedChartData.newListings ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("newListings")}
        >
          New Listings
        </button>
        <button
          className={
            displayedChartData.priceReduced ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("priceReduced")}
        >
          Price Reduced
        </button>
        <button
          className={
            displayedChartData.daysOnMarket ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("daysOnMarket")}
        >
          Days on Market
        </button>
        <button
          className={
            displayedChartData.squareFeet ? activeBtnCSS : nonActiveBtnCSS
          }
          onClick={() => handleChartButtonClick("squareFeet")}
        >
          Square Feet
        </button>
      </div>
    </div>
  );
};

export default MonthlyInventoryChart;
