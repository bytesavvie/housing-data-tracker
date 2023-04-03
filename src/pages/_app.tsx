import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import "~/styles/react-search-select.css";

// Components
import Navbar from "../components/ui/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
