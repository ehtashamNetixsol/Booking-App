import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { getToken } from "@/utils/getToken";
import Loader from "@/components/Loader";
import EventForm from "@/components/EventForm";
import { toast } from "react-hot-toast";

const UpdateEventPage = () => {
  const [eventData, seteventData] = useState(null);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;

  const fetcheventData = async () => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.get(`/events/${eventId}`);
      if (response.data) {
        console.log(response.data.eventFound);
        response.data.eventFound.thumbnail = `uploads/${response.data.eventFound.thumbnail.replace(
          /^.*[\\\/]/,
          ""
        )}`;
        seteventData(response.data.eventFound);
        setloading(false);
      }
    } catch (error) {
      console.error("Error fetching Event:", error);
      toast.error("Error fetching Event:");
    }
  };

  useEffect(() => {
    setloading(true);
    fetcheventData();
  }, []);

  return (
    <div className="sm:container mx-3 sm:mx-auto my-10">
      <PageHeader heading="Edit Event" link="Home>> updateEvent >> id" />
      {loading ? (
        <Loader />
      ) : (
        eventData && <EventForm isEditing={true} eventData={eventData} />
      )}
    </div>
  );
};

export default ProtectedRoute(UpdateEventPage);
