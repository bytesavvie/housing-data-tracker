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
county_fips: 40023 --  1
county_name: choctaw, ok --- 2
median_listing_price: 457500 -- 3
median_listing_price_mm: 0.0184 -- 4
median_listing_price_yy: -0.01339 -- 5
active_listing_count: 374 -- 6
active_listing_count_mm: -0.0778 -- 7
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
median_listing_price_per_square_foot_mm,  25
median_listing_price_per_square_foot_yy,  26
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

const getStateData = async () => {
  try {
    const { data } = await axios.get<string>(
      "https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_County_History.csv"
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
        path.join(__dirname, `./county-data/${key}.csv`),
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
