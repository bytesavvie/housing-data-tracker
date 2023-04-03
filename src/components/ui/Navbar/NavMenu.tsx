// React
import { type FC } from "react";

// Next
import Link from "next/link";
import { useRouter } from "next/router";

// CSS
const activeNavItemCSS =
  "rounded-md bg-gray-900 px-3 py-2 font-medium text-white inline-block";
const nonActiveNavItemCSS =
  "rounded-md px-3 py-2 font-medium text-gray-300 hover:bg-gray-800 hover:text-white inline-block";

const NavMenu: FC = () => {
  const router = useRouter();

  return (
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="mt-4 flex flex-col p-2 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:font-medium">
        <li>
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

export default NavMenu;
