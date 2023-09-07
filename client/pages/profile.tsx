import PageHeader from "@/components/PageHeader";
import UserProfile from "@/components/UserProfile";
import React from "react";

const WriterProfilePage = () => {
  const userLocal = localStorage.getItem("user");
  const user = userLocal != null ? JSON.parse(userLocal) : null;
  console.log(user);
  return (
    <div className="my-2">
      <PageHeader heading="UserProfile" link="Home >> Profile" />
      {user && <UserProfile user={user} />}
    </div>
  );
};

export default WriterProfilePage;
