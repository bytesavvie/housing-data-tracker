// dotenv
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// fs
import { outputFileSync } from "fs-extra";

// path
import path from "path";

// axios
import axios from "axios";

// utils
import { csvToArray, extractStateFromName } from "./utils";

/*  Header Fields from csv
month_date_yyyymm: 202302 -- 0
cbsa_code: 26820 --  1
cbsa_title: Idaho Falls, ID --- 2
HouseholdRank: 302 --  3
median_listing_price: 457500 -- 4
median_listing_price_mm: 0.0184 -- 5
median_listing_price_yy: -0.01339 -- 6
active_listing_count: 374 -- 7
active_listing_count_mm: -0.0778 -- 8
active_listing_count_yy,  9
median_days_on_market,  10
median_days_on_market_mm,  11
median_days_on_market_yy,  12
new_listing_count,  13
new_listing_count_mm,  14
new_listing_count_yy,  15
price_increased_count,  16
price_increased_count_mm,  17
price_increased_count_yy,  18
price_reduced_count,  19
price_reduced_count_mm,  20
price_reduced_count_yy,  21
pending_listing_count,  22
pending_listing_count_mm,  23
pending_listing_count_yy,  24
median_listing_price_per_square_foot,  25
median_listing_price_per_square_foot_mm,  26
median_listing_price_per_square_foot_yy,  27
median_square_feet,  28
median_square_feet_mm,  29
median_square_feet_yy,  30
average_listing_price,  31
average_listing_price_mm,  32
average_listing_price_yy,  33
total_listing_count,  34
total_listing_count_mm,  35
total_listing_count_yy,  36
pending_ratio,  37
pending_ratio_mm,  38
pending_ratio_yy,  39
quality_flag  40
*/

const getStateData = async () => {
  try {
    const { data } = await axios.get<string>(
      "https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_Metro_History.csv"
    );

    // csvArray.length - 2
    const csvArray = csvToArray(data);
    const stateHash: { [key: string]: string[] } = {};
    const headerRow = csvArray[0] || [];

    for (let i = 1; i < csvArray.length - 2; i++) {
      const row = csvArray[i];

      if (row) {
        const stateId = extractStateFromName(row[2]);

        if (stateId && stateHash[stateId]) {
          stateHash[stateId]?.push(row.join(","));
        } else if (stateId) {
          stateHash[stateId] = [row.join(",")];
        }
      }
    }

    for (const [key, value] of Object.entries(stateHash)) {
      outputFileSync(
        path.join(__dirname, `./metroData/${key}.csv`),
        `${headerRow.join(",")}\r\n${value.join("\r\n")}`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

getStateData().catch((err) => {
  console.error(err);
});
