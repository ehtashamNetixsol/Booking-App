import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";

interface PropTypes {
  theme: string | undefined;
  curTheme: string | undefined;
  setTheme: (theme: string) => void;
}
let userLinks = [
  { href: "/user-dashboard", label: "My Dashboard" },
  { href: "/profile", label: "My Profile" },
  { href: "/createEvent", label: "Create Events" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/signin", label: "Sign out" },
];

function NavBar(Props: PropTypes) {
  const { theme, curTheme, setTheme } = Props;
  const [navbar, setNavbar] = useState(false);
  const [active, setActive] = useState(1);
  const router = useRouter();

  const userFromLocalStorage = localStorage.getItem("user");
  const user =
    userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;

  // const userRole = user?.role;
  // userLinks =
  //   userRole === "writer"
  //     ? [
  //         { href: "/writer-dashboard", label: "Writer Dashboard" },
  //         { href: "/createBlog", label: "Create Blogs" },
  //         { href: "/my-comments", label: "My Comments" },
  //         { href: "/profile", label: "My Profile" },
  //         { href: "/signin", label: "Sign out" },
  //       ]
  //     : userRole === "admin"
  //     ? [
  //         { href: "/admin-dashboard", label: "Admin Dashboard" },
  //         { href: "/add-categories", label: "Blog Categories" },
  //         { href: "/profile", label: "My Profile" },
  //         { href: "/admin-dashboard/users", label: "All Users" },
  //         { href: "/signin", label: "Sign out" },
  //       ]
  //     : [
  //         { href: "/become-writer", label: "Become Writer" },
  //         { href: "/signin", label: "Sign out" },
  //       ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // toast.success("Log out Success");
    router.push("/signin");
  };

  useEffect(() => {
    const TokenFromLocalStorage = localStorage.getItem("token");
    const token =
      TokenFromLocalStorage !== null ? JSON.parse(TokenFromLocalStorage) : null;
    //   console.log(token);

    if (!token) {
      // Token is missing
      return;
    }
    const checkToken = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND}/auth/checkToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // console.log(response.data);
          // Token is valid, allow access to the protected page
          return;
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          // Token is invalid, redirect to login
        }
      } catch (error) {
        // Error occurred, redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };
    checkToken();
  });
  return (
    <nav className="w-full bg-gradient-to-r to-[#1C0E59] from-[#33146D]  sticky py-2 top-0 z-50">
      <div className="container justify-between mx-auto md:items-center md:flex">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            {/* LOGO */}
            <Link href="/">
              <img src="/logo-no-background.svg" alt="logo" className="w-32" />
            </Link>
            {/* HAMBURGER BUTTON FOR MOBILE */}
            <div className="md:hidden flex items-center gap-2">
              {/* dark mode toggle button mobile */}
              <div className=" flex justify-center">
                {curTheme === "dark" ? (
                  <button
                    className="bg-black-700 hover:bg-black w-8 rounded-full border-purple-400 border-2  p-1"
                    onClick={() => setTheme("light")}
                  >
                    {" "}
                    <Image src="/moon.svg" alt="logo" height={50} width={50} />
                  </button>
                ) : (
                  <button
                    className="bg-gray-100 w-8 rounded-full border-purple-400 border-2  p-1 hover:bg-gray-300"
                    onClick={() => setTheme("dark")}
                  >
                    <Image src="/sun.svg" alt="logo" height={50} width={50} />
                  </button>
                )}
              </div>
              {user && (
                // Display user's profile circle when logged in
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-black dark:text-white font-semibold text-lg">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white text-black flex flex-col py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userLinks.map((link, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <Link
                              href={link.href}
                              className={`
                                ${active ? "bg-gray-100" : ""} 
                                "block px-4 py-2 text-sm text-gray-700"
                              `}
                              onClick={
                                link.label === "Sign out"
                                  ? handleLogout
                                  : undefined
                              }
                            >
                              {link.label}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      {/* <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard"
                            className={`
                            ${active ? "bg-gray-100" : ""} 
                            "block px-4 py-2 text-sm text-gray-700"
                            `}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/signin"
                            className={`
                            ${active ? "bg-gray-100" : ""} 
                            "block px-4 py-2 text-sm text-gray-700"
                            `}
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Sign out
                          </Link>
                        )}
                      </Menu.Item> */}
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
              <button
                className="p-2 md:hidden text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <Image src="/close.svg" width={30} height={30} alt="logo" />
                ) : (
                  <Image
                    src="/hamburger-menu.svg"
                    width={30}
                    height={30}
                    alt="logo"
                    className="focus:border-none active:border-none"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`pb-3 mt-8 md:flex md:items-center md:pb-0 md:mt-0 ${
              navbar ? "p-12 md:p-0 block" : "hidden"
            }`}
          >
            <ul className="h-screen md:h-auto items-center justify-center md:flex dark:text-white text-white font-bold ">
              <li
                className={`  text-xl  py-2 md:px-3 text-center border-b-2 md:border-b-0  hover:bg-purple-900  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                  active === 1 && "text-hoverColor"
                }`}
              >
                <Link
                  href="/"
                  onClick={() => {
                    setActive(1);
                    setNavbar(!navbar);
                  }}
                >
                  Home
                </Link>
              </li>
              <li
                className={` text-xl  py-2 px-3 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                  active === 2 && "text-hoverColor"
                }`}
              >
                <Link
                  href="/events"
                  onClick={() => {
                    setActive(2);
                    setNavbar(!navbar);
                  }}
                >
                  Events
                </Link>
              </li>
              {/* <li
                className={`text-xl  py-2 px-3 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                  active === 3 && "text-hoverColor"
                }`}
              >
                <Link
                  href="/contact"
                  onClick={() => {
                    setActive(3);
                    setNavbar(!navbar);
                  }}
                >
                  Contact
                </Link>
              </li> */}

              {user && (
                // Display user's profile circle when logged in
                <Menu as="div" className="relative ml-3 hidden md:block">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-black dark:text-white font-semibold text-lg">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white text-black flex flex-col py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userLinks.map((link, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <Link
                              href={link.href}
                              className={`
                                ${active ? "bg-gray-100" : ""} 
                                "block px-4 py-2 text-sm text-gray-700"
                              `}
                              onClick={
                                link.label === "Sign out"
                                  ? handleLogout
                                  : undefined
                              }
                            >
                              {link.label}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      {/* <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`
                            ${active ? "bg-gray-100" : ""} 
                            "block px-4 py-2 text-sm text-gray-700"
                            `}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item> */}
                      {/* <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/signin"
                            className={`
                            ${active ? "bg-gray-100" : ""} 
                            "block px-4 py-2 text-sm text-gray-700"
                            `}
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Sign out
                          </Link>
                        )}
                      </Menu.Item> */}
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
              {/* {!user && (
                <li
                  className={`text-xl dark:text-black text-white py-2 px-3 text-center border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                    active === 4 && "text-hoverColor"
                  }`}
                >
                  <Link
                    href="/signup"
                    onClick={() => {
                      setActive(4);
                      setNavbar(!navbar);
                    }}
                  >
                    Get Started
                  </Link>
                </li>
              )} */}
            </ul>

            {/* dark mode toggle buton */}
            <div className="flex mx-2 justify-center">
              {curTheme === "dark" ? (
                <button
                  className="bg-black-700 hover:bg-black w-8 rounded-full border-purple-400 border-2  p-1"
                  onClick={() => setTheme("light")}
                >
                  {" "}
                  <Image src="/moon.svg" alt="logo" height={50} width={50} />
                </button>
              ) : (
                <button
                  className="bg-gray-100 w-8 rounded-full border-purple-400 border-2  p-1 hover:bg-gray-300"
                  onClick={() => setTheme("dark")}
                >
                  <Image src="/sun.svg" alt="logo" height={50} width={50} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
