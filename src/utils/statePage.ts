// @aws-sdk/client-s3
import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";

// Utils
import { csvToArray } from "data/utils";

// Custom Types
import {
  type MonthlyInventoryChartDataPoint,
  type SelectSearchOption,
} from "~/customTypes";

export const formatMonthlyDate = (date: string) => {
  const year = date.slice(0, 4);
  const month = date.slice(4);
  return `${month}/${year}`;
};

export const getStateChartData = async (client: S3Client, stateId: string) => {
  const getStateDataCSV = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `state-data/${stateId}.csv`,
  });

  const stateDataCSVResponse = await client.send(getStateDataCSV);
  const csvStr = (await stateDataCSVResponse.Body?.transformToString()) || "";

  const stateDataArray = csvToArray(csvStr);
  const stateData: MonthlyInventoryChartDataPoint[] = [];

  for (let i = stateDataArray.length - 1; i > 0; i--) {
    const row = stateDataArray[i];

    if (row) {
      stateData.push({
        date: formatMonthlyDate(row[0] || ""), // date
        medianListingPrice: Number(row[3]),
        medianDaysOnMarket: Number(row[9]),
        newListingCount: Number(row[12]),
        totalListingCount: Number(row[33]),
        priceReduced: Number(row[18]),
        squareFeet: Number(row[27]),
      });
    }
  }

  return stateData;
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
