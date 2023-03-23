// @aws-sdk/client-s3
import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";

// Utils
import { csvToArray } from "data/utils";

// Custom Types
import { type StateDataPoint, type SelectSearchOption } from "~/customTypes";

export const getStateChartData = async (client: S3Client, stateId: string) => {
  const getStateDataCSV = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `state-data/${stateId}.csv`,
  });

  const stateDataCSVResponse = await client.send(getStateDataCSV);
  const csvStr = (await stateDataCSVResponse.Body?.transformToString()) || "";

  const stateDataArray = csvToArray(csvStr);
  const stateData: StateDataPoint[] = [];

  for (let i = 1; i < stateDataArray.length - 2; i++) {
    const row = stateDataArray[i];

    if (row) {
      stateData.push({
        date: row[0] || "",
        medianListingPrice: row[3] || "",
      });
    }
  }

  return stateData;
};

export const getSelectOptionsList = async (
  client: S3Client,
  stateId: string,
  listName: "county-list" | "zipcode-list"
) => {
  const getListOptions = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `${listName}/${stateId}.json`,
  });

  const listResponse = await client.send(getListOptions);
  const listJSONStr = (await listResponse.Body?.transformToString()) || "";
  const options = JSON.parse(listJSONStr) as SelectSearchOption[];
  return options;
};
