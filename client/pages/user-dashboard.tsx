import Loader from "@/components/Loader";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import WriterProtectedRoute from "@/components/WriterProtectedRoute";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFillTrash3Fill } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";

const userDashboardPage = () => {
  const [events, setevents] = useState([]);
  const [loading, setloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setselectedEventId] = useState("");
  const router = useRouter();

  const userFromLocalStorage = localStorage.getItem("user");
  const userHa =
    userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;
  const fetchEvents = async () => {
    // console.log(userHa);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/events/user/${userHa.userId}`
      );
      if (response.data.success) {
        response.data.events.map((event: any) => {
          event.thumbnail = `uploads/${event.thumbnail.replace(
            /^.*[\\\/]/,
            ""
          )}`;
          return event;
        });
        setevents(response.data.events);
        setloading(false);
        // console.log(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {
    setloading(true);
    fetchEvents();
  }, []);
  const handleDelete = async (eventId: string) => {
    setselectedEventId(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.delete(`/events/${selectedEventId}`);
      if (response.data) {
        await fetchEvents();
        setShowDeleteModal(false);
        setselectedEventId("");
        toast.success(response.data);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setselectedEventId("");
  };

  const handleEdit = (eventId: string) => {
    router.push(`/updateEvent/${eventId}`);
  };
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading={`${
          userHa.username[0].toUpperCase() + userHa.username.slice(1)
        }'s Dashboard`}
        link="Home >> user-dashboard"
      />
      <div className="flex gap-3 justify-center flex-wrap">
        {loading ? (
          <Loader />
        ) : events.length >= 1 ? (
          events.map((event: any, index) => (
            <div
              key={index}
              className="bg-white max-w-[20rem] border-2 border-black dark:border-primary rounded-lg overflow-hidden relative shadow-sm shadow-gray-700 dark:shadow-gray-500"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND}/${event.thumbnail}`}
                alt={event.title}
                className="w-full h-44 p-2 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">{event.createdAt}</p>
                <Link
                  href={`/events/${event._id}`}
                  className="text-primary hover:underline"
                >
                  Read More
                </Link>
              </div>
              <div className="absolute bottom-0 right-0 p-2">
                <button
                  onClick={() => handleDelete(event._id)}
                  className=" text-red-600 text-lg hover:text-xl px-2 py-2 rounded-md"
                >
                  <BsFillTrash3Fill />
                </button>
                <button
                  onClick={() => handleEdit(event._id)}
                  className=" text-primary text-lg hover:text-xl px-2 py-2 rounded-md"
                >
                  <BsPencilSquare />
                </button>
              </div>
              {/* ***************************** Show delete modal ********************************** */}
              {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-md">
                    <p>Are you sure you want to delete this event?</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={confirmDelete}
                        className="text-red-500 mr-4 hover:text-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <Link
            href={"/createEvent"}
            className="font-bold hover:text-primary underline text-md sm:text-3xl"
          >
            Get Started By creating event
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProtectedRoute(userDashboardPage);
