// React
import { useState } from "react";

// Next
import Head from "next/head";

// react-select-search
import SelectSearch from "react-select-search";

// Components
import USMap from "../../components/maps/USMap";

const activeTabCSS =
  "active inline-block w-full rounded-t-lg border-b-2 border-white border-white p-4 text-2xl text-white text-white";
const nonActiveTabCSS =
  "inline-block w-full cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 text-2xl hover:border-gray-300 hover:text-gray-600 hover:text-gray-300";

const akCounties = [
  { name: "anchorage", value: "2020" },
  { name: "haines", value: "2100" },
  { name: "fairbanks north star", value: "2090" },
  { name: "nome", value: "2180" },
  { name: "matanuska-susitna", value: "2170" },
  { name: "denali", value: "2068" },
  { name: "petersburg", value: "2195" },
  { name: "aleutians west", value: "2016" },
  { name: "lake and peninsula", value: "2164" },
  { name: "kodiak island", value: "2150" },
  { name: "hoonah-angoon", value: "2105" },
  { name: "bethel", value: "2050" },
  { name: "skagway", value: "2230" },
  { name: "juneau", value: "2110" },
  { name: "wrangell", value: "2275" },
  { name: "prince of wales-hyder", value: "2198" },
  { name: "sitka", value: "2220" },
  { name: "north slope", value: "2185" },
  { name: "kenai peninsula", value: "2122" },
  { name: "yukon-koyukuk", value: "2290" },
  { name: "southeast fairbanks", value: "2240" },
  { name: "ketchikan gateway", value: "2130" },
  { name: "dillingham", value: "2070" },
];

const StatePage = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    "county" | "zipcode"
  >("county");

  return (
    <>
      <Head>
        <title key="title">{`US Housing Market - State Data`}</title>
        <meta
          name="description"
          content="Data and charts showing different housing Market metrics at the state level."
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className="px-2 sm:px-4">
        <main className="container relative mx-auto pb-4">
          <div className="mt-16 w-full text-center md:absolute md:mt-24">
            <h2 className="mb-4 text-center text-3xl text-white">
              Monthly Inventory Data By State
            </h2>
            <p className="m-auto max-w-xl text-center text-slate-400">
              Click on a state in the map to view that state&apos;s data below.
            </p>
          </div>
          <div className="h-0 md:h-32" />

          <div className="m-auto mb-4 max-w-[850px]">
            <USMap />
          </div>
          <section>
            <div className="mb-4 border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <ul className="-mb-px grid grid-cols-2">
                <li
                  className="mr-2"
                  onClick={() => setSelectedSubCategory("county")}
                >
                  <h2
                    className={
                      selectedSubCategory === "county"
                        ? activeTabCSS
                        : nonActiveTabCSS
                    }
                  >
                    County Data
                  </h2>
                </li>
                <li onClick={() => setSelectedSubCategory("zipcode")}>
                  <h2
                    className={
                      selectedSubCategory === "zipcode"
                        ? activeTabCSS
                        : nonActiveTabCSS
                    }
                  >
                    Zipcode Data
                  </h2>
                </li>
              </ul>
            </div>

            <section className="min-h-[500px]">
              <div className="m-auto w-1/2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  County
                </label>
                <SelectSearch
                  options={akCounties}
                  placeholder="Choose County"
                  search
                />
              </div>
            </section>
          </section>
        </main>
      </div>
    </>
  );
};

export default StatePage;
