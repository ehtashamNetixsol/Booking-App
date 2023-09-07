import { userLocal } from "@/types";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getToken } from "@/utils/getToken";

const UserProfile = (Props: userLocal) => {
  const { user } = Props;
  let [userr, setUser] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // console.log(user);

  const handlePictureUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getUserInfo = async () => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.get("/auth/profile");

      if (response.data && response.data.user) {
        const userInfo = response.data.user;
        userInfo.profilePicture = `uploads/${userInfo.profilePicture.replace(
          /^.*[\\\/]/,
          ""
        )}`;
        // console.log(userInfo);
        let userDoc = userInfo;
        setUser(userDoc);
        console.log(userDoc);
      } else {
        console.error("User information not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("inside");
    const selectedFile = e.target.files?.[0];
    // console.log(selectedFile);

    if (selectedFile) {
      try {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        const axiosInstance = getToken();
        const response = await axiosInstance.patch(
          `/auth/updateProfilePicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          toast.success("Profile picture uplaoded success");
          getUserInfo();
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="flex flex-col items-center p-8">
      <div
        className="bg-gray-200 rounded-full w-24 h-24 overflow-hidden flex items-center justify-center relative mb-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hovered && (
          <label
            htmlFor="profile-picture-upload"
            className="absolute inset-0 bg-black opacity-75 flex items-center justify-center"
          >
            <button
              className="bg-primary text-white rounded-full cursor-pointer p-2 m-2"
              onClick={handlePictureUpload}
            >
              <BsPencilSquare />
            </button>
          </label>
        )}
        <img
          src={
            userr.profilePicture
              ? `${process.env.NEXT_PUBLIC_BACKEND}/${userr.profilePicture}`
              : "/profile-icon-9.png"
          }
          alt="profileImg"
          className="w-full"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
            <p className="text-white">Uploading...</p>
          </div>
        )}
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <div className="p-4">
        <table className="table-auto w-full">
          <tbody>
            <tr className="border-b">
              <td className="font-semibold pr-4 py-2">Username:</td>
              <td className="py-2">{user.username}</td>
            </tr>
            <tr className="border-b">
              <td className="font-semibold pr-4 py-2">Email:</td>
              <td className="py-2">{user.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProfile;
