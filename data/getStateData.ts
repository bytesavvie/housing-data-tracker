// dotenv
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// axios
import axios from "axios";

// @aws-sdk-v3
import {
  DynamoDBClient,
  PutItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/*  Header Fields from csv
month_date_yyyymm,  0
state,  1
state_id,  2
median_listing_price,  3
median_listing_price_mm,  4
median_listing_price_yy,  5
active_listing_count,  6
active_listing_count_mm,  7
active_listing_count_yy,  8
median_days_on_market,  9
median_days_on_market_mm,  10
median_days_on_market_yy,  11
new_listing_count,  12
new_listing_count_mm,  13
new_listing_count_yy,  14
price_increased_count,  15
price_increased_count_mm,  16
price_increased_count_yy,  17
price_reduced_count,  18
price_reduced_count_mm,  19
price_reduced_count_yy,  20
pending_listing_count,  21
pending_listing_count_mm,  22
pending_listing_count_yy,  23
median_listing_price_per_square_foot,  24
median_listing_price_per_square_foot_mm  25
,median_listing_price_per_square_foot_yy,  26
median_square_feet,  27
median_square_feet_mm,  28
median_square_feet_yy,  29
average_listing_price,  30
average_listing_price_mm,  31
average_listing_price_yy,  32
total_listing_count,  33
total_listing_count_mm,  34
total_listing_count_yy,  35
pending_ratio,  36
pending_ratio_mm,  37
pending_ratio_yy,  38
quality_flag  39
*/

interface StateDataPoint {
  M: {
    date: { S: string };
    state: { S: string };
    stateId: { S: string };
    medianListingPrice: { S: string };
    medianListingPriceMM: { S: string };
    medianListingPriceYY: { S: string };
    activeListingCount: { S: string };
    activeListingCountMM: { S: string };
    activeListingCountYY: { S: string };
    medianDaysOnMarket: { S: string };
    medianDaysOnMarketMM: { S: string };
    medianDaysOnMarketYY: { S: string };
    newListingCount: { S: string };
    newListingCountMM: { S: string };
    newListingCountYY: { S: string };
    priceIncreasedCount: { S: string };
    priceIncreasedCountMM: { S: string };
    priceIncreasedCountYY: { S: string };
    priceReducedCount: { S: string };
    priceReducedCountMM: { S: string };
    priceReducedCountYY: { S: string };
    pendingListingCount: { S: string };
    pendingListingCountMM: { S: string };
    pendingListingCountYY: { S: string };
    medianListingPricePerSquareFoot: { S: string };
    medianListingPricePErSquareFootMM: { S: string };
    medianListingPricePErSquareFootYY: { S: string };
    medianSquareFeet: { S: string };
    medianSquareFeetMM: { S: string };
    medianSquareFeetYY: { S: string };
    averageListingPrice: { S: string };
    averageListingPriceMM: { S: string };
    averageListingPriceYY: { S: string };
    totalListingCount: { S: string };
    totalListingCountMM: { S: string };
    totalListingCountYY: { S: string };
    pendingRatio: { S: string };
    pendingRatioMM: { S: string };
    pendingRatioYY: { S: string };
  };
}

const createStateDataPoint = (csvRow: string[]) => {
  const dataPoint = {
    date: csvRow[0] || "",
    state: csvRow[1] || "",
    stateId: csvRow[2] || "",
    medianListingPrice: csvRow[3] || "",
    medianListingPriceMM: csvRow[4] || "",
    medianListingPriceYY: csvRow[5] || "",
    activeListingCount: csvRow[6] || "",
    activeListingCountMM: csvRow[7] || "",
    activeListingCountYY: csvRow[8] || "",
    medianDaysOnMarket: csvRow[9] || "",
    medianDaysOnMarketMM: csvRow[10] || "",
    medianDaysOnMarketYY: csvRow[11] || "",
    newListingCount: csvRow[12] || "",
    newListingCountMM: csvRow[13] || "",
    newListingCountYY: csvRow[14] || "",
    priceIncreasedCount: csvRow[15] || "",
    priceIncreasedCountMM: csvRow[16] || "",
    priceIncreasedCountYY: csvRow[17] || "",
    priceReducedCount: csvRow[18] || "",
    priceReducedCountMM: csvRow[19] || "",
    priceReducedCountYY: csvRow[20] || "",
    pendingListingCount: csvRow[21] || "",
    pendingListingCountMM: csvRow[22] || "",
    pendingListingCountYY: csvRow[23] || "",
    medianListingPricePerSquareFoot: csvRow[24] || "",
    medianListingPricePErSquareFootMM: csvRow[25] || "",
    medianListingPricePErSquareFootYY: csvRow[26] || "",
    medianSquareFeet: csvRow[27] || "",
    medianSquareFeetMM: csvRow[28] || "",
    medianSquareFeetYY: csvRow[29] || "",
    averageListingPrice: csvRow[30] || "",
    averageListingPriceMM: csvRow[31] || "",
    averageListingPriceYY: csvRow[32] || "",
    totalListingCount: csvRow[33] || "",
    totalListingCountMM: csvRow[34] || "",
    totalListingCountYY: csvRow[35] || "",
    pendingRatio: csvRow[36] || "",
    pendingRatioMM: csvRow[37] || "",
    pendingRatioYY: csvRow[38] || "",
  };

  return dataPoint;
};

const createStateDataPoint2 = (csvRow: string[]) => {
  const dataPoint: AttributeValue = {
    M: {
      date: { S: csvRow[0] || "" },
      state: { S: csvRow[1] || "" },
      stateId: { S: csvRow[2] || "" },
      medianListingPrice: { S: csvRow[3] || "" },
      medianListingPriceMM: { S: csvRow[4] || "" },
      medianListingPriceYY: { S: csvRow[5] || "" },
      activeListingCount: { S: csvRow[6] || "" },
      activeListingCountMM: { S: csvRow[7] || "" },
      activeListingCountYY: { S: csvRow[8] || "" },
      medianDaysOnMarket: { S: csvRow[9] || "" },
      medianDaysOnMarketMM: { S: csvRow[10] || "" },
      medianDaysOnMarketYY: { S: csvRow[11] || "" },
      newListingCount: { S: csvRow[12] || "" },
      newListingCountMM: { S: csvRow[13] || "" },
      newListingCountYY: { S: csvRow[14] || "" },
      priceIncreasedCount: { S: csvRow[15] || "" },
      priceIncreasedCountMM: { S: csvRow[16] || "" },
      priceIncreasedCountYY: { S: csvRow[17] || "" },
      priceReducedCount: { S: csvRow[18] || "" },
      priceReducedCountMM: { S: csvRow[19] || "" },
      priceReducedCountYY: { S: csvRow[20] || "" },
      pendingListingCount: { S: csvRow[21] || "" },
      pendingListingCountMM: { S: csvRow[22] || "" },
      pendingListingCountYY: { S: csvRow[23] || "" },
      medianListingPricePerSquareFoot: { S: csvRow[24] || "" },
      medianListingPricePErSquareFootMM: { S: csvRow[25] || "" },
      medianListingPricePErSquareFootYY: { S: csvRow[26] || "" },
      medianSquareFeet: { S: csvRow[27] || "" },
      medianSquareFeetMM: { S: csvRow[28] || "" },
      medianSquareFeetYY: { S: csvRow[29] || "" },
      averageListingPrice: { S: csvRow[30] || "" },
      averageListingPriceMM: { S: csvRow[31] || "" },
      averageListingPriceYY: { S: csvRow[32] || "" },
      totalListingCount: { S: csvRow[33] || "" },
      totalListingCountMM: { S: csvRow[34] || "" },
      totalListingCountYY: { S: csvRow[35] || "" },
      pendingRatio: { S: csvRow[36] || "" },
      pendingRatioMM: { S: csvRow[37] || "" },
      pendingRatioYY: { S: csvRow[38] || "" },
    },
  };

  return dataPoint;
};

const getStateData = async () => {
  try {
    const { data } = await axios.get<string>(
      "https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_State_History.csv"
    );
    const lines = data.split(/\r|\r?\n/g);
    const stateHash: { [key: string]: { L: AttributeValue.MMember } } = {};

    // First line is the header columns;
    // Last four lines are either empty strings or contain the quality flag description (last line of actual data is lines.length - 5)

    for (let i = 1; i < lines.length - 4; i++) {
      const columns = lines[i]?.split(",") || [];
      const stateId = columns[2];
      const stateDataPoint = createStateDataPoint2(columns);

      if (
        stateId &&
        stateHash[stateId] &&
        stateHash[stateId]?.L !== undefined
      ) {
        stateHash[stateId]?L.push(stateDataPoint);
      } else if (stateId) {
        stateHash[stateId] = { L: [stateDataPoint] };
      }
    }

    const states = Object.keys(stateHash);

    // Define the table name and item to insert
    const tableName = "UsHousingDataByState";
    const item = {
      stateId: { S: "TX" },
      data: stateHash["TX"] || { S: "" },
    };

    // Create the PutItem command with the table name and item
    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: item,
    });

    const result = await client.send(putItemCommand);
    console.log("result", result);

    console.log(states.length);
    console.log(states);
  } catch (err) {
    console.log(err);
  }
};

getStateData().catch((err) => {
  console.error(err);
});
