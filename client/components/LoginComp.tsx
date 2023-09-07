import { LoginSchema } from "@/Schema";
import { loginData } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const Signin: NextPage = () => {
  const [ischecked, setIsChecked] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const onsubmit = async (data: loginData) => {
    const { email, password } = data;
    // console.log(ischecked, data);
    const rememberMe = ischecked ? "true" : "false";

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/auth/login/${rememberMe}`,
        data
      );

      if (resp.data.success) {
        // console.log(resp.data);
        router.push("/");
        toast.success(resp.data.message);

        localStorage.setItem("user", JSON.stringify(resp.data.user));
        localStorage.setItem("token", JSON.stringify(resp.data.token));
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      const knownError = error as Error;
      console.log(knownError.message);
      toast.error(knownError.message);
    }
  };
  const onForgotPasswordClick = useCallback(() => {
    router.push("/forgetPass");
  }, []);

  return (
    <div className=" flex md:flex-row flex-col md:justify-around items-center justify-evenly w-full h-auto min-h-screen overflow-hidden text-left dark:bg-black ">
      <div className=" flex flex-col  px-[1.5rem]  z-10 ">
        <h1 className="m-0 text-[2rem] xs:text-[2.5rem] leading-snug sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[6rem] font-semibold font-inherit ml-4">
          Welcome Back..!
        </h1>
        <h4 className="m-0 px-2 border-[4px] border-solid border-black dark:border-white  text-[1rem] md:text-[1.5rem] xl:text-[2rem] md:self-start md:text-left text-center bg-hoverColor md:bg-transparent md:text-black text-white md:dark:text-white  italic font-semibold font-inherit ml-4">
          Reach Your Maximum ?
        </h4>
      </div>

      <div className="relative md:mt-5 mt-0">
        {/******************************** top circle *********************************/}
        <div className="absolute right-80 top-[-7rem] rounded-[50%]   blur-[3px] dark:blur-0  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />
        {/********************************** bottom circle ************************** */}
        <div className="absolute right-[-4rem] bottom-[-10rem] rounded-[50%]  blur-[3px] dark:blur-0  [background:linear-gradient(180deg,_#530061,_#0d0a30)] w-[15rem] h-[15rem] md:w-[18.88rem] md:h-[18.88rem]" />
        <div className=" border-black dark:border-white mt-2 border-2 rounded-[20px] bg-white dark:[background:linear-gradient(-38.77deg,_rgba(191,_191,_191,_0.06),_rgba(0,_0,_0,_0)),_rgba(0,_0,_0,_0.14)] shadow-[-8px_4px_5px_rgba(0,_0,_0,_0.24)] [backdrop-filter:blur(53px)] overflow-hidden flex flex-col py-[1rem] mx-10 w-[15rem] xs:w-[20rem] sm:w-[30rem] box-border items-center justify-end text-[2.25rem]">
          <div className="flex flex-col items-center justify-start my-2">
            <h1 className="m-0 font-semibold font-inherit dark:text-white">
              Login
            </h1>
            <div className=" text-[1rem] font-medium dark:text-white">
              Glad you’re back.!
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col items-start justify-start gap-[1.56rem] text-[1.25rem] w-full px-4"
          >
            <div className="h-[4.5rem] w-full">
              <input
                className="font-noto-sans text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white text-black dark:text-white dark:placeholder-white placeholder-black"
                type="text"
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
                className="text-[1.25rem] bg-[transparent] rounded-xl box-border  w-full flex flex-row py-[0.88rem] px-[1rem] items-center justify-start border-[1px] border-solid border-black dark:border-white  text-black dark:text-white dark:placeholder-white placeholder-black"
                type="password"
                {...register("password")}
                placeholder="Password"
                name="password"
              />

              <img
                className="absolute right-5 top-5 w-[1.13rem] h-[1.13rem] overflow-hidden shrink-0"
                alt="closedeyeimg"
                src="/closed eye.svg"
              />
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-row items-center justify-start gap-[0.25rem] text-[1rem]">
              <input
                className="cursor-pointer relative w-[1.13rem] h-[1.13rem] overflow-hidden shrink-0 text-white"
                type="checkbox"
                onChange={() => {
                  setIsChecked((prev) => !prev);
                }}
              />
              <div className="relative font-medium ">Remember me</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-[0.75rem] text-[1rem] w-full">
              <button
                className="cursor-pointer [border:none] py-[0.6rem]  px-[0.63rem] bg-[transparent] rounded-xl   [background:linear-gradient(90.57deg,_#9333db,_#8740cd_53.13%,_#580475)]  w-full flex flex-row box-border items-center justify-center text-[1.25rem] font-semibold text-white"
                type="submit"
              >
                Login
              </button>
              <div
                className="relative font-medium cursor-pointer "
                onClick={onForgotPasswordClick}
              >
                Forgot password?
              </div>
            </div>
            <div className="flex flex-col items-center justify-start gap-[0.5rem] text-[1rem]">
              <div className="relative font-medium cursor-pointer">
                Don’t have an account ?{" "}
                <Link href="/signup" className="text-green-600 hover:underline">
                  Signup
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
