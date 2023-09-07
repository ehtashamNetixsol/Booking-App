import EventCard from "@/components/EventCard/EventCard";
import Loader from "@/components/Loader";
import PageHeader from "@/components/PageHeader";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";

interface PropTypes {
  headCol: string;
  items: number;
}

export default function Events({ headCol, items }: PropTypes) {
  const [events, setevents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setbookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 2;
  const pageCount = Math.ceil(events.length / eventsPerPage);

  const userFromLocalStorage = localStorage.getItem("user");
  const userHa =
    userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;

  const handleSearch = () => {
    setLoading(true);
    // Update your event fetching logic to include the search query
    fetchEventsWithSearch();
  };

  const fetchEventsWithSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/events`,
        {
          params: {
            search: searchQuery,
          },
        }
      );
      if (response.data) {
        response.data.map((event: any) => {
          event.thumbnail = `uploads/${event.thumbnail.replace(
            /^.*[\\\/]/,
            ""
          )}`;
          return event;
        });
        setevents(response.data);

        // setLoading(false);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching events with search:", error);
      toast.error("Error fetching events");
    } finally {
      setLoading(false);
    }
  };
  const fetchBookings = async () => {
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

  const fetchEventsByCategory = async (category: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/events?category=${category}`
      );
      if (response.data) {
        response.data.map((blog: any) => {
          const originalDate = new Date(blog.createdAt);
          const formattedDate = format(originalDate, "MMMM d, yyyy");
          blog.createdAt = formattedDate;
          blog.thumbnail = `uploads/${blog.thumbnail.replace(/^.*[\\\/]/, "")}`;
          return blog;
        });
        setevents(response.data);
        setLoading(false);
        // console.log("categoreis", response.data);
      }
    } catch (error) {
      console.error("Error fetching events by category:", error);
      toast.error("error fetching events");
    }
  };

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/events`
      );
      if (response.data) {
        // console.log("all", response.data);
        response.data.map((blog: any) => {
          blog.thumbnail = `uploads/${blog.thumbnail.replace(/^.*[\\\/]/, "")}`;
          return blog;
        });
        setevents(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("error fetching events");
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    setLoading(true);
    fetchAllEvents();
    fetchBookings();
  }, []);
  // useEffect(() => {
  //   if (selectedCategory) {
  //     setLoading(true);
  //     fetchEventsByCategory(selectedCategory);
  //   } else {
  //     setLoading(true);
  //     fetchAllEvents();
  //   }
  //   fetchCategories();
  // }, [selectedCategory]);

  const offset = currentPage * eventsPerPage;
  const paginatedevents = events.slice(offset, offset + eventsPerPage);
  return (
    <div className="container mx-auto my-3">
      <PageHeader heading="All UpComing Events" link="Home >> events" />

      {/* filters */}
      <div className="w-full bg-gray-400 flex items-center justify-center py-2">
        {/* <select
          className="border rounded py-2 px-3 text-black dark:text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" className="text-black  bg-gray-500">
            All Categories
          </option>
          {categories.map((category: { _id: string; title: string }) => (
            <option
              key={category._id}
              value={category._id}
              className="text-black  bg-gray-500"
            >
              {category.title}
            </option>
          ))}
        </select> */}
        <div className="w-full bg-gray-400 flex items-center gap-2 flex-wrap justify-center py-2">
          <div>Search by title or desciption</div>
          <input
            type="text"
            placeholder="Search events..."
            className="border rounded py-2 px-3 text-black dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-primary hover:bg-secondary px-2 py-2 text-white rounded-md ml-2"
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : paginatedevents.length === 0 ? (
        <h3 className="text-center">No results found!</h3>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {paginatedevents.map((event: any, index) => {
              const isEventBooked = bookings.some(
                (booking: any) =>
                  booking.event._id === event._id &&
                  booking.user._id === userHa.userId
              );
              // console.log(isEventBooked);
              return (
                <EventCard key={index} event={event} isbooked={isEventBooked} />
              );
            })}
          </div>

          <div className="pagination-container sm:text-normal text-[12px]">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              previousLinkClassName={"previous"}
              nextLinkClassName={"next"}
              disabledClassName={"disabled"}
              activeClassName={"active"}
            />
          </div>
        </>
      )}
    </div>
  );
}
