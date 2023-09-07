import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

interface PropTypes {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const AsideNav = ({ setShow, show }: PropTypes) => {
  const inactiveLink = 'flex gap-2 p-1 pr-10 hover:bg-highlight';
  const activeLink = inactiveLink + ' bg-highlight text-primary rounded-l-lg';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';
  const router = useRouter();
  const { pathname } = router;
  async function logout() {
    await router.push('/');
    toast.success('User logged out');
  }
  return (
    <aside
      className={
        (show ? 'left-0' : '-left-full') +
        ' top-0  p-4 pr-0 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all block md:hidden'
      }
    >
      {/* <div className="mb-4 mr-4">
        <Logo />
      </div> */}
      {/* {session?.user?.role === 'restaurant' && ( */}
        <nav className="flex flex-col gap-2 text-lg">
          <Link
            href={'/restaurant/dashboard'}
            className={
              pathname === '/restaurant/dashboard' ? activeLink : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname === '/restaurant/dashboard' ? activeIcon : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            href={'/restaurant/pending'}
            className={
              pathname.includes('/restaurant/pending')
                ? activeLink
                : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname.includes('/restaurant/pending')
                  ? activeIcon
                  : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            Pending
          </Link>

          <Link
            href={'/restaurant/accepted'}
            className={
              pathname.includes('/restaurant/accepted')
                ? activeLink
                : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname.includes('/restaurant/accepted')
                  ? activeIcon
                  : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Accepted
          </Link>

          <Link
            href={'/restaurant/delivered'}
            className={
              pathname.includes('/restaurant/delivered')
                ? activeLink
                : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname.includes('/restaurant/delivered')
                  ? activeIcon
                  : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            Delivered
          </Link>
          <Link
            href={'/restaurant/foodItems'}
            className={
              pathname.includes('/restaurant/foodItems')
                ? activeLink
                : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname.includes('/restaurant/foodItems')
                  ? activeIcon
                  : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            Food Items
          </Link>
          <Link
            href={'/restaurant/categories'}
            className={
              pathname.includes('/restaurant/categories')
                ? activeLink
                : inactiveLink
            }
            onClick={() => {
              setShow(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={
                pathname.includes('/restaurant/categories')
                  ? activeIcon
                  : inactiveIcon
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            Categories
          </Link>
        </nav>
      {/* )} */}
      {/* {session?.user ? ( */}
        <button
          className={inactiveLink}
          onClick={() => {
            logout();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
      {/* ) : ( */}
        <div className="flex md:hidden gap-2 flex-col mt-3">
          <Link
            className="  py-2 md:px-3 text-center my-[1.5rem] mx-[1.2rem] mb-0 text-xl bg-blue-500 hover:bg-blue-600 text-white font-bold  rounded-xl transition duration-200"
            href="/usertype/signin"
            onClick={() => {
              setShow(false);
            }}
          >
            Sign In
          </Link>
          <Link
            className=" py-2 md:px-3 text-center m-[1.2rem] text-xl bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition duration-200"
            href={`/usertype/signup`}
            onClick={() => {
              setShow(false);
            }}
          >
            Sign up
          </Link>
        </div>
      {/* )} */}

      <button
        className="absolute right-5 top-5 text-2xl font-bold"
        onClick={() => {
          setShow(false);
        }}
      >
        X
      </button>
    </aside>
  );
};

export default AsideNav;
