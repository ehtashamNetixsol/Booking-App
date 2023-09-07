import { ComponentType, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface WrapperProps {
  children: ReactNode;
}

const ProtectedRoute = (WrappedComponent: ComponentType<any>) => {
  const Wrapper = (props: WrapperProps) => {
    const router = useRouter();

    // Check token validity
    useEffect(() => {
      const TokenFromLocalStorage = localStorage.getItem("token");
      const token =
        TokenFromLocalStorage !== null
          ? JSON.parse(TokenFromLocalStorage)
          : null;
      //   console.log(token);

      if (!token) {
        // Token is missing, redirect to login, remove token and user
        router.replace("/signin");
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
            router.replace("/signin");
          }
        } catch (error) {
          // Error occurred, redirect to login
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.replace("/signin");
        }
      };

      checkToken();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default ProtectedRoute;
