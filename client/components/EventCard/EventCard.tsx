import React, { useState } from "react";
import styles from "./Blog.module.css";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getToken } from "@/utils/getToken";
import { formatDateToString } from "@/utils/formatDate";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "../TicketPdf";

const EventCard = ({ event, swiper = false, isbooked }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const router = useRouter();
  const userFromLocalStorage = localStorage.getItem("user");
  const userHa =
    userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;
  // console.log(userHa);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const GotoSingleEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleBooking = async (e: any, eventid: string) => {
    if (e.target.tagName === "BUTTON") {
      e.stopPropagation();
      toggleModal();
    }
  };

  const handleConfirmBooking = async () => {
    const data = {
      event: event._id,
      tickets: selectedTickets,
    };
    // console.log(data);

    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.post(`/bookings/new`, data);
      if (resp.data.success) {
        console.log(resp.data);
        toast.success(resp.data.message);
        setShowConfirmation(true);
        setShowPDF(true);
        // router.push(`/events/${event._id}`);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      console.log(error);
    }

    // Close the modal
    toggleModal();
  };
  const handleClosePDFViewer = () => {
    setShowConfirmation(false);
  };
  return (
    <div
      className={`${
        styles.mPostCardGrid
      } shadow-md shadow-gray-300 border-[1px] rounded-md border-black h-auto border-solid m-[8px] ${
        !swiper && "w-[240px] sm:w-[380px] lg:w-[370px]"
      }`}
    >
      <img
        className={`${styles.mPostCardGridChild} w-full h-[12rem] object-center`}
        alt="cover photo"
        src={`${process.env.NEXT_PUBLIC_BACKEND}/${event.thumbnail}`}
      />
      <div className={styles.content} >
        <div className={`${styles.heading} relative sm:z-10`}>
          <div className="sm:absolute top-0 right-0 font-bold">
            {!isbooked ? (
              <button
                className="bg-primary hover:bg-secondary px-2 py-2 text-white rounded-md"
                onClick={(e) => {
                  handleBooking(e, event._id);
                }}
              >
                Book Event
              </button>
            ) : (
              <button className="bg-primary disabled px-2 py-2 text-white rounded-md">
                Booked
              </button>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-md">
                  <h2 className="text-black">Select Number of Tickets</h2>
                  <div className="text-center">
                    <input
                      type="number"
                      value={selectedTickets}
                      onChange={(e) =>
                        setSelectedTickets(parseInt(e.target.value))
                      }
                      className="border-2 border-black bg-white my-5 text-black px-2 py-2"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleConfirmBooking}
                      className="text-red-500 mr-4 hover:text-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={toggleModal}
                      className="text-gray-500 mr-4 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className={`${styles.aBadge}`}>
            <div className={`${styles.text1} text-secondary font-bold`}>
              {event.category.title}
            </div>
          </div> */}
          <div className={`${styles.title} relative`}>{event.title}</div>
        </div>
        <div className={`${styles.shortInfo} flex-wrap`}>
          <div className={styles.aAuthor}>
            <img className={styles.imageIcon1} alt="" src="./1st.jpg" />
            <div className={styles.author}>
              {capitalizeFirstLetter(event.user.username)}
            </div>
          </div>
          <div>
            <p>{formatDateToString(event.date) + " " + event.time}</p>
          </div>

          {/* <div className={styles.date}>{event.createdAt}</div> */}
        </div>
        <div
          className="w-full"
          onClick={() => {
            GotoSingleEvent(event._id);
          }}
        >
          <button className="bg-primary hover:bg-purple-500 text-white px-4 py-2 w-full rounded-md">
            READ MORE...
          </button>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center z-30 justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <PDFViewer width={400} height={400}>
              <TicketPDF event={event} />
            </PDFViewer>
            <PDFDownloadLink
              document={
                <TicketPDF event={event} bookingUser={userHa.username} />
              }
              fileName="ticket.pdf"
            ></PDFDownloadLink>
            <button
              onClick={handleClosePDFViewer}
              className="text-red-500 mt-4 hover:text-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function capitalizeFirstLetter(str: string) {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export default EventCard;
