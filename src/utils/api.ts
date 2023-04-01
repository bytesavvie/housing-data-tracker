// @aws-sdk/client-s3
import { SelectObjectContentCommand, type S3Client } from "@aws-sdk/client-s3";

// Utils
import { csvToArray } from "data/utils";
import { formatMonthlyDate, decimalToPercent } from "./statePage";

// Custom Types
import {
  type MonthlyInventoryChartDataPoint,
  type SelectSearchOption,
  type ChangeOverTimeChartDataPoint,
} from "~/customTypes";

export const getCountyChartData = async (
  client: S3Client,
  stateId: string,
  countyId: string
) => {
  const getCountyDataCSV = new SelectObjectContentCommand({
    Bucket: process.env.BUCKET,
    Key: `county-data/${stateId}.csv`,
    ExpressionType: "SQL",
    Expression: `SELECT * FROM S3Object s WHERE s."county_fips" = '${countyId}'`,
    InputSerialization: {
      CSV: {
        FileHeaderInfo: "USE",
        RecordDelimiter: "\n",
        FieldDelimiter: ",",
      },
      CompressionType: "NONE",
    },
    OutputSerialization: {
      CSV: {
        RecordDelimiter: "\n",
        FieldDelimiter: ",",
      },
    },
  });

  const countyDataCSVResponse = await client.send(getCountyDataCSV);

  const decoder = new TextDecoder("utf-8");
  let data = "";

  if (countyDataCSVResponse.Payload) {
    for await (const event of countyDataCSVResponse.Payload) {
      if (event.Records && event.Records.Payload) {
        const chunk = event.Records.Payload;
        const decodedChunk = decoder.decode(chunk, { stream: true });
        data += decodedChunk;
      }
    }
  }

  const countyDataArray = csvToArray(data);
  const countyInventoryData: MonthlyInventoryChartDataPoint[] = [];
  const countyChangeOverTimeData: ChangeOverTimeChartDataPoint[] = [];

  for (let i = countyDataArray.length - 1; i > 0; i--) {
    const row = countyDataArray[i];

    if (row && row[0]) {
      countyInventoryData.push({
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
      countyChangeOverTimeData.push({
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
        pendingRatioYY: decimalToPercent(row[38] || ""),
      });
    }
  }

  return {
    countyInventoryData,
    countyChangeOverTimeData,
  };
};
