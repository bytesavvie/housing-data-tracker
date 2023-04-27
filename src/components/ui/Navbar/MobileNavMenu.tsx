// React
import type { FC } from "react";

// Next
import Link from "next/link";
import { useRouter } from "next/router";

// CSS
const activeNavItemCSS =
  "rounded-md bg-gray-900 px-3 py-2 font-medium text-white inline-block";
const nonActiveNavItemCSS =
  "rounded-md px-3 py-2 font-medium text-gray-300 hover:bg-gray-800 hover:text-white inline-block";

interface IProps {
  isOpen: boolean;
}

const MobileNavMenu: FC<IProps> = ({ isOpen }) => {
  const router = useRouter();

  return (
    <div className="md:hidden " id="navbar-default">
      <ul
        className={`overflow-hidden text-center transition-all ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <li className="mt-3 mb-2">
          <Link
            href="/"
            className={
              router?.pathname === "/" ? activeNavItemCSS : nonActiveNavItemCSS
            }
          >
            National
          </Link>
        </li>
        <li>
          <Link
            href={`/state`}
            className={
              router?.pathname.includes("/state")
                ? activeNavItemCSS
                : nonActiveNavItemCSS
            }
          >
            State
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileNavMenu;
