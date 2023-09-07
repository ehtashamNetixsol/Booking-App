import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    // Get user data from local storage
    const userData = localStorage.getItem("user");

    const user = userData !== null ? JSON.parse(userData) : null;

    // If user role is not 'admin', redirect to home page
    if (user?.role !== "admin") {
      router.push("/signin");
    }
  }, []);
  return <>{children}</>;
};

export default AdminProtectedRoute;
