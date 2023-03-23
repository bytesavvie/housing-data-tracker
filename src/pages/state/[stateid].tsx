// React
import { useState } from "react";

// Next
import Head from "next/head";
import { type GetStaticProps, type GetStaticPaths, type NextPage } from "next";

// react-select-search
import SelectSearch, { type SelectedOptionValue } from "react-select-search";

// Components
import USMap from "../../components/maps/USMap";

// Custom Types
import { type StateDataPoint, type SelectSearchOption } from "~/customTypes";

// utils
import { createS3Client } from "~/utils/s3";
import { allStates } from "~/utils/USMap";
import { getStateChartData, getSelectOptionsList } from "~/utils/statePage";

const activeTabCSS =
  "active inline-block w-full rounded-t-lg border-b-2 border-white border-white p-4 text-2xl text-white text-white";
const nonActiveTabCSS =
  "inline-block w-full cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 text-2xl hover:border-gray-300 hover:text-gray-600 hover:text-gray-300";

interface IProps {
  stateData: StateDataPoint[];
  countyOptions: SelectSearchOption[];
  zipcodeOptions: SelectSearchOption[];
}

const StatePage: NextPage<IProps> = ({
  stateData,
  countyOptions,
  zipcodeOptions,
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    "county" | "zipcode"
  >("county");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");

  const handleCountySelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[]
  ) => {
    if (typeof selectedValue === "string") {
      setSelectedCounty(selectedValue);
    }
  };

  const handleZipcodeSelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[]
  ) => {
    if (typeof selectedValue === "string") {
      setSelectedZipcode(selectedValue);
    }
  };

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
                {selectedSubCategory === "county" ? (
                  <>
                    <label
                      htmlFor="county"
                      className="mb-2 block text-sm font-medium text-white"
                    >
                      County
                    </label>
                    <SelectSearch
                      options={countyOptions}
                      placeholder="Choose County"
                      search
                      value={selectedCounty}
                      onChange={(selectedValue) =>
                        handleCountySelect(selectedValue)
                      }
                    />
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="zipcode"
                      className="mb-2 block text-sm font-medium text-white"
                    >
                      Zipcode
                    </label>
                    <SelectSearch
                      options={zipcodeOptions}
                      placeholder="Choose Zipcode"
                      search
                      value={selectedZipcode}
                      onChange={(selectedValue) =>
                        handleZipcodeSelect(selectedValue)
                      }
                    />
                  </>
                )}
              </div>
            </section>
          </section>
        </main>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  // console.log(context);
  const stateId = context?.params?.stateid;

  if (typeof stateId !== "string") {
    return {
      props: {},
    };
  }

  const client = createS3Client();
  const stateData = await getStateChartData(client, stateId);

  const countyOptions = await getSelectOptionsList(
    client,
    stateId,
    "county-list"
  );
  const zipcodeOptions = await getSelectOptionsList(
    client,
    stateId,
    "zipcode-list"
  );

  return {
    props: {
      stateData,
      countyOptions,
      zipcodeOptions,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = allStates.map((state) => {
    return { params: { stateid: state.id } };
  });

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export default StatePage;
