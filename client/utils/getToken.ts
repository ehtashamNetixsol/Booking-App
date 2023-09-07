import Cookies from "js-cookie";
import axios from "axios";

export const getToken = () => {
  const tokenLocalStorage = localStorage.getItem("token");
  const token =
    tokenLocalStorage !== null ? JSON.parse(tokenLocalStorage) : null;
  // console.log(token);
  // Create an axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return axiosInstance;
};
