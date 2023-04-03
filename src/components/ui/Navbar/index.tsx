// React
import { useState } from "react";

// Next
import Image from "next/image";

// Components
import NavMenu from "./NavMenu";
import MobileNavMenu from "./MobileNavMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-10 w-full border-gray-200 bg-gray-700 px-2 py-2 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 sm:h-9">
            <Image
              src="/images/logo.png"
              alt="Website Logo"
              height={32}
              width={32}
            />
          </div>
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
            US Housing Data
          </span>
        </div>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <NavMenu />
      </div>
      <MobileNavMenu isOpen={isOpen} />
    </nav>
  );
};

export default Navbar;
