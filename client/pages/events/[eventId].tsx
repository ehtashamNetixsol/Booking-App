import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getToken } from "@/utils/getToken";
import { format } from "date-fns";
import PageHeader from "@/components/PageHeader";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import Link from "next/link";
import { formatDateToString } from "@/utils/formatDate";

const eventIdPage = () => {
  const [event, setevent] = useState<any>(null);
  const [attendees, setAttendees] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const userLocal = localStorage.getItem("user");
  const user = userLocal != null ? JSON.parse(userLocal) : null;
  // console.log(user);

  const router = useRouter();
  const { eventId } = router.query;
  //   console.log(eventId);

  const fetchSingleevent = async () => {
    try {
      if (!eventId) {
        router.push("/events");
        return;
      }
      const axiosInstance = getToken();
      const response = await axiosInstance.get(`/events/${eventId}`);
      //   console.log(response.data);
      if (response.data) {
        const { eventFound } = response.data;
        eventFound.thumbnail = `uploads/${eventFound.thumbnail.replace(
          /^.*[\\\/]/,
          ""
        )}`;

        setevent(eventFound);
        // console.log(eventFound);

        const attendeesResponse = await axiosInstance.get(
          `/bookings/${eventId}/attendees`
        );
        console.log(attendeesResponse.data);
        if (attendeesResponse.data && attendeesResponse.data.success) {
          setAttendees(attendeesResponse.data.attendees);
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    fetchSingleevent();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-2">
      {!event ? (
        <Loader />
      ) : (
        <>
          <PageHeader heading={event.title} link="Home >> events >> id" />
          <h1 className="text-xl sm:text-3xl font-semibold pt-14">
            {event.title}
          </h1>
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND}/${event.thumbnail}`}
            alt={event.title}
            className="w-full mb-4"
          />
          <div
            dangerouslySetInnerHTML={{ __html: event.description }}
            className={"mb-4"}
          ></div>
          <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-md shadow-gray-300 dark:shadow-gray-600">
            <p className="mb-2 text-2xl font-semibold text-black">
              Event By: {Capitalize(event.user.username)}
            </p>
            <p className="text-gray-600">
              Event Date: {formatDateToString(event.date)}
            </p>
          </div>
        </>
      )}

      {/* List of attendees */}
      {attendees.length >= 1 && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Attendees For This Event</h2>
          <ul className="grid grid-cols-2 gap-2 mt-2">
            {attendees.map((attendee: any) => (
              <li
                key={attendee._id}
                className="bg-gray-100 p-2 rounded-md shadow-md shadow-gray-300 dark:shadow-gray-600 font-bold"
              >
                {Capitalize(attendee.user.username)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function Capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export default eventIdPage;
