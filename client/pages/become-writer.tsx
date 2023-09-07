import PageHeader from "@/components/PageHeader";
import { getToken } from "@/utils/getToken";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BecomeWriterPage = () => {
  const [requestSent, setRequestSent] = useState(false);
  const userLocal = localStorage.getItem("user");
  const user = userLocal != null ? JSON.parse(userLocal) : null;
  const { userId } = user;

  useEffect(() => {
    if (user.writerRequest === "sent") {
      setRequestSent(true);
      toast.success("You have already sent request to become a writer");
    }
  }, []);

  const handleWriterRequest = async () => {
    // console.log(userId);

    if (!userId) {
      return toast.error("No user found");
    }
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.post(`/auth/become-writer/${userId}`);
      if (resp.data.success) {
        toast.success(resp.data.message);
        setRequestSent(true);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Error sending request");
    }
  };
  return (
    <div className="container mx-auto py-10">
      <PageHeader heading="Become a Writer" link="Home >> become-writer" />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          Benefits of Becoming a Writer
        </h1>
        <ul className="list-disc ml-6">
          <li>Create and publish your own blogs.</li>
          <li>Update and manage your published blogs.</li>
          <li>Delete your blogs if needed.</li>
          <li>Engage with the community by commenting on others' blogs.</li>
        </ul>
      </div>
      <button
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={requestSent}
        onClick={() => handleWriterRequest()}
      >
        Become a Writer
      </button>
    </div>
  );
};

export default BecomeWriterPage;
