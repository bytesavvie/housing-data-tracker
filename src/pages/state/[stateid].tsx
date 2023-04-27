// React
import { useEffect, useState } from "react";

// Next
import Head from "next/head";
import { useRouter } from "next/router";
import { type GetStaticProps, type GetStaticPaths, type NextPage } from "next";

// react-select-search
import SelectSearch, {
  type SelectedOptionValue,
  type SelectedOption,
} from "react-select-search";

// axios
import axios from "axios";

// react-device-detect
// import { isMobile } from "react-device-detect";
const isMobile = false;

// Components
import USMap from "../../components/maps/USMap";
import MonthlyInventoryChart from "~/components/charts/MonthlyInventoryChart";
import MobileMonthlyInventoryChart from "~/components/charts/MobileMonthlyInventoryChartData";
import PercentBarChart from "~/components/charts/PercentBarChart";
import ChartDataSection from "~/components/ui/ChartDataSection";

// Custom Types
import type {
  SelectSearchOption,
  MonthlyInventoryChartDataPoint,
  ChangeOverTimeChartDataPoint,
  dataApiResponse,
} from "~/customTypes";

// utils
import { createS3Client } from "~/utils/s3";
import { allStates } from "~/utils/USMap";
import { getStateChartData, getSelectOptionsList } from "~/utils/statePage";
import { changeOverTimeMetrics } from "../../components/ui/ChartDataSection";

const activeTabCSS =
  "active inline-block w-full rounded-t-lg border-b-2 border-white border-white p-4 text-2xl text-white text-white";
const nonActiveTabCSS =
  "inline-block w-full cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 text-2xl hover:border-gray-300 hover:text-gray-600 hover:text-gray-300";

interface IProps {
  stateInventoryData: MonthlyInventoryChartDataPoint[];
  stateChangeOverTimeData: ChangeOverTimeChartDataPoint[];
  countyOptions: SelectSearchOption[];
  zipcodeOptions: SelectSearchOption[];
}

const StatePage: NextPage<IProps> = ({
  stateInventoryData,
  stateChangeOverTimeData,
  countyOptions,
  zipcodeOptions,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    "county" | "zipcode"
  >("county");
  const [selectedStateMetric, setSelectedStateMetric] =
    useState<SelectedOption>({
      index: 1,
      name: "Median Listing Price (Y/Y)",
      value: "medianListingPriceYY",
    });

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [selectedCountyMetric, setSelectedCountyMetric] =
    useState<SelectedOption>({
      index: 1,
      name: "Median Listing Price (Y/Y)",
      value: "medianListingPriceYY",
    });
  const [countyInventoryData, setCountyInventoryData] = useState<
    MonthlyInventoryChartDataPoint[]
  >([]);
  const [countyChangeOverTimeData, setCountyChangeOverTimeData] = useState<
    ChangeOverTimeChartDataPoint[]
  >([]);
  const [selectedZipcodeMetric, setSelectedZipcodeMetric] =
    useState<SelectedOption>({
      index: 1,
      name: "Median Listing Price (Y/Y)",
      value: "medianListingPriceYY",
    });
  const [zipcodeInventoryData, setZipcodeInventoryData] = useState<
    MonthlyInventoryChartDataPoint[]
  >([]);
  const [zipcodeChangeOverTimeData, setZipcodeChangeOverTimeData] = useState<
    ChangeOverTimeChartDataPoint[]
  >([]);

  const handleMetricSelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[]
  ) => {
    if (!Array.isArray(selectedOption)) {
      setSelectedStateMetric(selectedOption);
    }
  };

  const handleCountyMetricSelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[]
  ) => {
    if (!Array.isArray(selectedOption)) {
      setSelectedCountyMetric(selectedOption);
    }
  };

  const handleZipcodeMetricSelect = (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[]
  ) => {
    if (!Array.isArray(selectedOption)) {
      setSelectedZipcodeMetric(selectedOption);
    }
  };

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

  const extractStateNameFromId = () => {
    const stateId = router.query.stateid;

    if (typeof stateId === "string") {
      const result = allStates.find((state) => state.id === stateId);
      if (!result) return "";
      return result.fullName;
    }

    return "";
  };

  const extractCountyNameFromId = () => {
    const result = countyOptions.find(
      (county) => county.value === selectedCounty
    );

    if (result) {
      return result.name;
    }

    return "";
  };

  useEffect(() => {
    const fetchCountyData = async () => {
      setIsLoading(true);
      try {
        const stateId = router.query.stateid;

        if (typeof stateId === "string") {
          const { data } = await axios.get<dataApiResponse>(
            `/api/housing-data?state=${stateId}&county=${selectedCounty}`
          );
          setCountyInventoryData(data.inventoryData);
          setCountyChangeOverTimeData(data.changeOverTimeData);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    if (selectedCounty) {
      void fetchCountyData();
    }
  }, [selectedCounty, router.query.stateid]);

  useEffect(() => {
    const fetchZipcodeData = async () => {
      setIsLoading(true);
      try {
        const stateId = router.query.stateid;

        if (typeof stateId === "string") {
          const { data } = await axios.get<dataApiResponse>(
            `/api/housing-data?state=${stateId}&zipcode=${selectedZipcode}`
          );
          setZipcodeInventoryData(data.inventoryData);
          setZipcodeChangeOverTimeData(data.changeOverTimeData);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    if (selectedZipcode) {
      void fetchZipcodeData();
    }
  }, [selectedZipcode, router.query.stateid]);

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
        <main className="container relative mx-auto pb-8">
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

          <section className="mb-16">
            <h2 className="mb-4 text-center text-3xl text-white">
              Monthly Inventory Data - {extractStateNameFromId()}
            </h2>
            <p className="m-auto mb-6 max-w-xl text-center text-slate-400">
              The data below shows the values for different housing metrics in
              the United States. Click on the buttons below to view different
              metrics in the chart. Data is provided by{" "}
              <a
                href="https://www.realtor.com/research/data/"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                relator.com
              </a>
            </p>
            {isMobile ? (
              <MobileMonthlyInventoryChart chartData={stateInventoryData} />
            ) : (
              <MonthlyInventoryChart chartData={stateInventoryData} />
            )}
          </section>
          <section className="mb-16">
            <h2 className="mb-4 text-center text-3xl text-white">
              Trends Over Time - {extractStateNameFromId()}
            </h2>
            <p className="m-auto mb-6 max-w-xl text-center text-slate-400">
              The data in this section shows the rate of change of different
              housing metrics over time. These metrics can be view on a year
              over year basis or month over month basis. Values are represented
              as percents (ex. Listing prices may be 10% higher this month on a
              year over year basis). Data is provided by{" "}
              <a
                href="https://www.realtor.com/research/data/"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                relator.com
              </a>
            </p>
            <div className="m-auto mb-8 max-w-md">
              <label
                htmlFor="county"
                className="mb-2 block text-sm font-medium text-white"
              >
                Metric
              </label>
              <SelectSearch
                options={changeOverTimeMetrics}
                placeholder="Select Metric"
                search
                value={selectedStateMetric.value as string}
                onChange={(selectedValue, selectedOption) =>
                  handleMetricSelect(selectedValue, selectedOption)
                }
              />
            </div>
            <PercentBarChart
              containerClasses="lg:h-[450px] h-[400px]"
              chartData={stateChangeOverTimeData}
              dataKey={
                selectedStateMetric.value as keyof ChangeOverTimeChartDataPoint
              }
              barName={selectedStateMetric.name}
              barColor="#34d399"
            />
          </section>

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

          {isLoading && (
            <div
              className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center"
              style={{ background: "rgba(0, 0, 0, 0.5)" }}
            >
              <div
                role="status"
                className="item-center flex flex-col justify-center"
              >
                <svg
                  aria-hidden="true"
                  className="m-auto mb-2 inline h-10 w-10 animate-spin fill-gray-600 text-center text-gray-200 dark:fill-gray-300 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <p className="text-white">Loading data...</p>
              </div>
            </div>
          )}

          <div className="min-h-[500px]">
            {selectedSubCategory === "county" ? (
              <>
                <div className="m-auto mb-16 max-w-md">
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
                </div>
                {selectedCounty && countyInventoryData.length > 0 && (
                  <ChartDataSection
                    isMobile={isMobile}
                    inventoryDataTitle={`County Inventory Data - ${extractCountyNameFromId()}`}
                    trendOverTimeTitle={`Trends Over Time - ${extractCountyNameFromId()}`}
                    inventoryData={countyInventoryData}
                    changeOverTimeData={countyChangeOverTimeData}
                    selectedMetric={selectedCountyMetric}
                    handleMetricChange={handleCountyMetricSelect}
                  />
                )}
              </>
            ) : (
              <>
                <div className="m-auto mb-16 max-w-md">
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
                </div>
                {selectedZipcode && zipcodeInventoryData.length > 0 && (
                  <ChartDataSection
                    isMobile={isMobile}
                    inventoryDataTitle={`Zipcode Inventory Data - ${selectedZipcode}`}
                    trendOverTimeTitle={`Trends Over Time - ${selectedZipcode}`}
                    inventoryData={zipcodeInventoryData}
                    changeOverTimeData={zipcodeChangeOverTimeData}
                    selectedMetric={selectedZipcodeMetric}
                    handleMetricChange={handleZipcodeMetricSelect}
                  />
                )}
              </>
            )}
          </div>
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
  const { stateInventoryData, stateChangeOverTimeData } =
    await getStateChartData(client, stateId);

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
      stateInventoryData,
      stateChangeOverTimeData,
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
