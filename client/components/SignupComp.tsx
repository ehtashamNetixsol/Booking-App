import { RegisterSchema } from "@/Schema";
import { signupData } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });
  // console.log(process.env.NEXT_PUBLIC_BACKEND)

  const onsubmit = async (data: signupData) => {
    const { username, email, password } = data;
    console.log(data);

    data = {
      username,
      email: email,
      password,
    };

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/auth/signup`,
        data
      );

      if (resp.data.success) {
        // console.log(resp.data);
        router.push("/signin");
        toast.success(resp.data.message);
      }
    } catch (error) {
      const knownError = error as Error;
      console.log(knownError.message);
      toast.error(knownError.message);
    }
  };

  return (
    <div className="pb-4 flex md:flex-row flex-col md:justify-around items-center justify-evenly w-full  overflow-hidden text-left dark:bg-black h-auto min-h-screen">
      <div className=" flex flex-col  px-[1.5rem] z-10 h-auto">
        <h1 className=" text-[1.2rem] xs:text-[2rem] leading-snug sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[6rem] font-semibold ml-4">
          Create, Attend Events...!
        </h1>
        <p className="px-2 border-[4px] border-solid border-black dark:border-white text-[1rem] md:text-[1.5rem] xl:text-[2rem] md:self-start md:text-left text-center bg-hoverColor md:bg-transparent md:text-black text-white md:dark:text-white  italic font-semibold ml-4">
          Reach your Followers?
        </p>
      </div>

      <div className="relative md:mt-5 mt-0">
        {/******************************** top circle *********************************/}
        <div className="absolute right-80 top-[-7rem] rounded-[50%]   blur-[3px] dark:blur-0  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />
        {/********************************** bottom circle ************************** */}
        <div className="absolute right-[-4rem] bottom-[-10rem] rounded-[50%]   blur-[3px] dark:blur-0  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />

        <div className=" border-black dark:border-white mt-2 border-2 rounded-[20px] bg-white dark:[background:linear-gradient(-38.77deg,_rgba(191,_191,_191,_0.06),_rgba(0,_0,_0,_0)),_rgba(0,_0,_0,_0.14)] shadow-[-8px_4px_5px_rgba(0,_0,_0,_0.24)] [backdrop-filter:blur(53px)] overflow-hidden flex flex-col py-[1rem] mx-10 w-[15rem] xs:w-[20rem] sm:w-[30rem] box-border items-center justify-end text-[2.25rem]">
          <div className="flex flex-col items-center justify-start my-2">
            <h1 className="m-0 font-semibold font-inherit dark:text-white">
              Register
            </h1>
            {/* <div className=" text-[1rem] font-medium dark:text-white">
              Explore exciting blogs...!
            </div> */}
          </div>

          <form
            className="flex flex-col items-start justify-start gap-[1.56rem] text-[1.25rem] w-full px-4"
            onSubmit={handleSubmit(onsubmit)}
          >
            <div className="h-[4.5rem] w-full">
              <input
                className="text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-black dark:text-white dark:placeholder-white placeholder-black"
                type="text"
                {...register("username")}
                name="username"
                placeholder="Username"
              />
              {errors.username && (
                <span className="text-red-600 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="h-[4.5rem] w-full">
              <input
                className="font-noto-sans text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-black dark:text-white dark:placeholder-white placeholder-black"
                type="email"
                {...register("email")}
                name="email"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="h-[4.5rem] flex flex-col relative items-start justify-start gap-[0.75rem] w-full">
              <input
                className="font-noto-sans text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-black dark:text-white dark:placeholder-white placeholder-black"
                type="password"
                {...register("password")}
                name="password"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}

              {/* <img
                className="absolute right-5 top-5 w-[1.13rem] h-[1.13rem] overflow-hidden shrink-0"
                alt=""
                src="/closed eye.svg"
              /> */}
            </div>
            <div className="h-[4.5rem] w-full">
              <input
                className="font-noto-sans text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-black dark:text-white dark:placeholder-white placeholder-black"
                type="password"
                {...register("confirmPassword")}
                name="confirmPassword"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <span className="text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            {/* <div className="h-[4.5rem] w-full flex flex-col text-[16px] sm:text-xl">
              <div className="flex gap-2 items-center">
                <label htmlFor="user">I just want to explore blogs</label>
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="user"
                  id="user"
                  className="h-5 w-5 mr-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 items-center">
                <label htmlFor="writer">I want to write Blogs</label>
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="writer"
                  id="writer"
                  className="h-5 w-5 mr-2 focus:ring-indigo-500"
                />
              </div>

              {errors.role && (
                <span className="text-red-600 text-sm">
                  {errors.role.message}
                </span>
              )}
            </div> */}

            <div className="flex flex-col items-center justify-center gap-[0.75rem] text-[1rem] w-full">
              <button
                className="cursor-pointer [border:none] py-[0.6rem]  px-[0.63rem] bg-[transparent] rounded-xl   [background:linear-gradient(90.57deg,_#9333db,_#8740cd_53.13%,_#580475)]  w-full flex flex-row box-border items-center justify-center text-[1.25rem] font-semibold text-white"
                type="submit"
              >
                Lets Go!
              </button>
            </div>
            <div className="flex flex-col items-center justify-start gap-[0.5rem] text-[1rem]">
              <div className="relative font-medium cursor-pointer">
                Already have an account ?{" "}
                <Link
                  href="/signin"
                  className="text-green-600  hover:underline"
                >
                  SignIn
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
