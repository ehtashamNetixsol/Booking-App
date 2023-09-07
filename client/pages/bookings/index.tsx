import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatDateToString } from "@/utils/formatDate";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFillTrash3Fill } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";

const bookingsPage = () => {
  const [ticket, setticket] = useState("");
  const [editingBooking, seteditingBooking] = useState<any>(null);
  const [newTicket, setnewTicket] = useState(0);

  const [error, setError] = useState("");
  const [bookings, setbookings] = useState([]);

  const fetchBookings = async () => {
    const userFromLocalStorage = localStorage.getItem("user");
    const userHa =
      userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;

    if (!userHa) {
      return null;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/bookings/${userHa.userId}`
      );
      if (response.data.success) {
        setbookings(response.data.bookings);
        console.log(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("error fetching bookings");
      console.error("Error fetching bookings:", error);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!ticket) {
      return setError("ticket is required");
    }

    try {
      setError("");
      const axiosInstance = getToken();
      const response = await axiosInstance.post("/bookings/new", { ticket });
      if (response.data.success) {
        setticket("");
        console.log(response.data);
        toast.success(response.data.message);
        fetchBookings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleDeletebooking = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.delete(`/bookings/${id}`);
      if (response.status === 200) {
        toast.success(response.data);
        fetchBookings();
      } else {
        toast.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("An error occurred while deleting booking");
    }
  };

  const handleEditbooking = (booking: any) => {
    seteditingBooking({ tickets: booking.tickets, id: booking._id });
    setnewTicket(booking.tickets);
  };

  const cancelUpdate = () => {
    seteditingBooking(null);
    setnewTicket(0);
  };
  const confirmUpdate = async () => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.put(
        `/bookings/${editingBooking.id}`,
        { tickets: newTicket }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBookings(); // Refresh the bookings list
        seteditingBooking(null); // Close the modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("An error occurred while updating booking");
    }
  };

  return (
    <div className="p-6">
      <PageHeader heading="Event Bookings" />

      <div className="overflow-x-scroll sm:overflow-x-hidden">
        <table className="sm:w-50  shadow-md mx-auto border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="border p-2 ">Events</th>
              <th className="border p-2 ">Event Date</th>
              <th className="border p-2 ">Tickets</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking._id}>
                <td className="border sm:p-5 sm:px-10 font-bold">
                  {booking.event.title}
                </td>
                <td className="border p-2">
                  {formatDateToString(booking.event.date)}
                </td>
                <td className="border p-2">{booking.tickets}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white text-[12px] sm:text-xl px-2 py-1 rounded mb-1 sm:mr-2"
                    onClick={() => handleDeletebooking(booking._id)}
                  >
                    <BsFillTrash3Fill />
                  </button>
                  <button
                    className="bg-primary hover:bg-secondary text-white text-[12px] sm:text-xl px-2 py-1 rounded"
                    onClick={() => handleEditbooking(booking)}
                  >
                    <BsPencilSquare />
                  </button>

                  {editingBooking && (
                    <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
                      <div className="bg-white p-8 rounded-md">
                        <h2 className="text-black">Select Number of Tickets</h2>
                        <div className="text-center">
                          <input
                            type="number"
                            value={newTicket}
                            onChange={(e) =>
                              setnewTicket(parseInt(e.target.value))
                            }
                            className="border-2 border-black bg-white my-5 text-black px-2 py-2"
                          />
                        </div>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={confirmUpdate}
                            className="text-red-500 mr-4 hover:text-red-700"
                          >
                            Update
                          </button>
                          <button
                            onClick={cancelUpdate}
                            className="text-gray-500 mr-4 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProtectedRoute(bookingsPage);
