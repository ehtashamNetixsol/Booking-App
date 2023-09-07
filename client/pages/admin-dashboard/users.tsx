import PageHeader from "@/components/PageHeader";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredusers, setfilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/auth/users`
      );
      setUsers(response.data.users);
      //   console.log(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveWriter = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.post(`/auth/approveWriter/${id}`);

      if (resp.data.success) {
        toast.success(resp.data.message);
        fetchUsers();
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Error approving writer");
    }
  };

  const blockUser = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.post(`/auth/blockUser/${id}`);

      if (resp.data.success) {
        toast.success(resp.data.message);
        fetchUsers();
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Error blocking user");
    }
  };

  const unblockUser = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.post(`/auth/unblockUser/${id}`);

      if (resp.data.success) {
        toast.success(resp.data.message);
        fetchUsers();
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Error unblocking user");
    }
  };

  const filteredUsers = users.filter((user: any) => {
    if (activeTab === "approveWriters") {
      return user.writerRequest === "sent";
    } else if (activeTab === "block") {
      return user.status === "unblocked";
    } else if (activeTab === "unblock") {
      return user.status === "blocked";
    }
    return true;
  });
  //   console.log(filteredUsers);
  return (
    <div className="container mx-auto py-10 px-2">
      <PageHeader
        heading="Users Management"
        link="Home >> admin-dashboard >> users"
      />
      {/* Tabs */}
      <div className="mb-4 flex justify-center gap-2 items-center flex-wrap">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === ""
              ? "bg-primary text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("")}
        >
          All Users
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "approveWriters"
              ? "bg-primary text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("approveWriters")}
        >
          Writer Requests
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "block"
              ? "bg-primary text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("block")}
        >
          Block Users
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "unblock"
              ? "bg-primary text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("unblock")}
        >
          Unblock Users
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        {filteredUsers.map((user: any) => (
          <div
            key={user._id}
            className="bg-white w-full dark:bg-gray-700 border-2 p-4 rounded shadow-md flex items-center justify-between flex-wrap"
          >
            <div className="flex justify-between items-center w-full">
              <div className="">
                <p>
                  Username:<span className="font-bold"> {user.username}</span>
                </p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
              </div>
              {activeTab === "approveWriters" && (
                <button
                  className="bg-primary font-bold text-[10px] sm:text-[1rem] py-1 px-2 sm:py-2 sm:px-4 hover:bg-secondary text-white rounded"
                  onClick={() => {
                    approveWriter(user._id);
                  }}
                >
                  Approve as Writer
                </button>
              )}

              {activeTab === "block" && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded ml-2"
                  onClick={() => {
                    blockUser(user._id);
                  }}
                >
                  Block
                </button>
              )}
              {activeTab === "unblock" && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded ml-2"
                  onClick={() => {
                    unblockUser(user._id);
                  }}
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
