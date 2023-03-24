// @aws-sdk/client-s3
import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";

// Utils
import { csvToArray } from "data/utils";

// Custom Types
import {
  type MonthlyInventoryChartDataPoint,
  type SelectSearchOption,
  type ChangeOverTimeChartDataPoint,
} from "~/customTypes";

export const formatMonthlyDate = (date: string) => {
  const year = date.slice(0, 4);
  const month = date.slice(4);
  return `${month}/${year}`;
};

const decimalToPercent = (numStr: string) => {
  const result = Number(numStr) * 100;
  return Number(result.toFixed(2));
};

export const getStateChartData = async (client: S3Client, stateId: string) => {
  const getStateDataCSV = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `state-data/${stateId}.csv`,
  });

  const stateDataCSVResponse = await client.send(getStateDataCSV);
  const csvStr = (await stateDataCSVResponse.Body?.transformToString()) || "";

  const stateDataArray = csvToArray(csvStr);
  const stateInventoryData: MonthlyInventoryChartDataPoint[] = [];
  const stateChangeOverTimeData: ChangeOverTimeChartDataPoint[] = [];

  for (let i = stateDataArray.length - 1; i > 0; i--) {
    const row = stateDataArray[i];

    if (row) {
      stateInventoryData.push({
        date: formatMonthlyDate(row[0] || ""), // date
        medianListingPrice: Number(row[3]),
        medianDaysOnMarket: Number(row[9]),
        newListingCount: Number(row[12]),
        totalListingCount: Number(row[33]),
        priceReduced: Number(row[18]),
        squareFeet: Number(row[27]),
      });
    }

    // check to make sure percent over time changes are included
    if (row && row[4]) {
      stateChangeOverTimeData.push({
        date: formatMonthlyDate(row[0] || ""),
        medianListingPriceMM: decimalToPercent(row[4]),
        medianListingPriceYY: decimalToPercent(row[5] || ""),
        activeListingCountMM: decimalToPercent(row[7] || ""),
        activeListingCountYY: decimalToPercent(row[8] || ""),
        medianDaysOnMarketMM: decimalToPercent(row[10] || ""),
        medianDaysOnMarketYY: decimalToPercent(row[11] || ""),
        newListingCountMM: decimalToPercent(row[13] || ""),
        newListingCountYY: decimalToPercent(row[14] || ""),
        priceIncreasedCountMM: decimalToPercent(row[16] || ""),
        priceIncreasedCountYY: decimalToPercent(row[17] || ""),
        priceReducedCountMM: decimalToPercent(row[19] || ""),
        priceReducedCountYY: decimalToPercent(row[20] || ""),
        pendingListingCountMM: decimalToPercent(row[22] || ""),
        pendingListingCountYY: decimalToPercent(row[23] || ""),
        medianListingPricePerSquareFootMM: decimalToPercent(row[25] || ""),
        medianListingPricePerSquareFootYY: decimalToPercent(row[26] || ""),
        medianSquareFeetMM: decimalToPercent(row[28] || ""),
        medianSquareFeetYY: decimalToPercent(row[29] || ""),
        averageListingPriceMM: decimalToPercent(row[31] || ""),
        averageListingPriceYY: decimalToPercent(row[32] || ""),
        totalListingCountMM: decimalToPercent(row[34] || ""),
        totalListingCountYY: decimalToPercent(row[35] || ""),
        pendingRatioMM: decimalToPercent(row[37] || ""),
        pedningRatioYY: decimalToPercent(row[38] || ""),
      });
    }
  }

  return { stateInventoryData, stateChangeOverTimeData };
};

export const getSelectOptionsList: (
  client: S3Client,
  stateId: string,
  listName: "county-list" | "zipcode-list"
) => Promise<SelectSearchOption[]> = async (client, stateId, listName) => {
  const getListOptions = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `${listName}/${stateId}.json`,
  });

  const listResponse = await client.send(getListOptions);
  const listJSONStr = (await listResponse.Body?.transformToString()) || "";
  const options = JSON.parse(listJSONStr) as SelectSearchOption[];
  return options;
};
