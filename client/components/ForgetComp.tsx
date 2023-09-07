import Link from 'next/link';
import React, { useCallback } from 'react';

const ForgetComp = () => {
  const onForgotPasswordClick = useCallback(() => {
    // Please sync "Forgot Password" to the project
  }, []);

  const onDontHaveAnClick = useCallback(() => {
    // Please sync "Signup" to the project
  }, []);
  return (
    <div className=" flex md:flex-row flex-col md:justify-around items-center justify-evenly w-full h-auto min-h-screen  overflow-hidden text-left dark:bg-black ">
      <div className=" flex flex-col  px-[1.5rem]  z-10 ">
        <h1 className="m-0 text-[2rem] xs:text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[6rem] font-semibold font-inherit ml-4">
          Got your Back..!
        </h1>
        <h4 className="m-0 px-2 border-[4px] border-solid border-black dark:border-white  text-[1rem] md:text-[1.5rem] xl:text-[2rem] md:self-start md:text-left text-center bg-hoverColor md:bg-transparent md:text-black text-white md:dark:text-white  italic font-semibold font-inherit ml-4">
          Take me back ?
        </h4>
      </div>

      <div className="relative md:mt-5 mt-0">
        {/******************************** top circle *********************************/}
        <div className="absolute right-80 top-[-7rem] rounded-[50%]   blur-[3px] dark:blur-0  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />
        {/********************************** bottom circle ************************** */}
        <div className="absolute right-[-4rem] bottom-[-10rem] rounded-[50%]   blur-[3px]  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />
        <div className=" border-black dark:border-white mt-2 border-2 rounded-[20px] bg-white dark:[background:linear-gradient(-38.77deg,_rgba(191,_191,_191,_0.06),_rgba(0,_0,_0,_0)),_rgba(0,_0,_0,_0.14)] shadow-[-8px_4px_5px_rgba(0,_0,_0,_0.24)] [backdrop-filter:blur(53px)] overflow-hidden flex flex-col py-[1rem] mx-10 w-[15rem] xs:w-[20rem] sm:w-[30rem] box-border items-center justify-end text-[2.25rem]">
          <div className="flex flex-col items-center justify-start my-2">
            <h1 className="m-0 font-semibold font-inherit dark:text-white mx-3">
              Forgot Password?
            </h1>
            <div className=" text-[1rem] font-medium dark:text-white">
              Please enter your email
            </div>
          </div>

          <div className="flex flex-col items-start justify-start gap-[1.56rem] text-[1.25rem] w-full px-4">
            <input
              className="font-noto-sans text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-white dark:placeholder-white placeholder-black"
              type="text"
              placeholder="Email"
              required
            />
            <div className="flex flex-col relative items-start justify-start gap-[0.75rem] w-full"></div>
            <div className="flex flex-col items-center justify-center gap-[0.75rem] text-[1rem] w-full">
              <button className="cursor-pointer [border:none] py-[0.6rem]  px-[0.63rem] bg-[transparent] rounded-xl   [background:linear-gradient(90.57deg,_#9333db,_#8740cd_53.13%,_#580475)]  w-full flex flex-row box-border items-center justify-center">
                <button className=" text-[1.25rem] font-semibold font-noto-sans text-white text-left">
                  Reset Password
                </button>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetComp;
