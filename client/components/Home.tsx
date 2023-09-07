import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { getToken } from "@/utils/getToken";
import { User } from "@/types";
import Link from "next/link";
import Typewriter from "typewriter-effect";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { toast } from "react-hot-toast";
import EventCard from "./EventCard/EventCard";

const HomeComponent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userFromLocalStorage = localStorage.getItem("user");
  const userHa =
    userFromLocalStorage !== null ? JSON.parse(userFromLocalStorage) : null;

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/events`
      );
      if (response.data) {
        // console.log("all", response.data);
        response.data.map((event: any) => {
          event.thumbnail = `uploads/${event.thumbnail.replace(
            /^.*[\\\/]/,
            ""
          )}`;
          return event;
        });
        setEvents(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("error fetching events");
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchAllEvents();
  }, []);

  return (
    <>
      <div className="h-auto md:h-[92vh] bg-[#33146D] m-0 mb-5  bg-[url('/bannerImg.png')] bg-no-repeat bg-cover">
        <div className="container mx-auto flex h-auto items-center justify-center py-2">
          <div className="flex flex-col items-center gap-4 py-36 ">
            <h1 className=" text-3xl sm:text-5xl md:text-7xl font-bold text-center text-white">
              <Typewriter
                options={{
                  strings: [
                    "Discover Unique Experiences",
                    "Create Lasting Memories",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
            <h4 className="text-1xl md:text-2xl text-center font-semibold text-white opacity-80">
              An Online Hub for Event Enthusiasts to Discover, Book, and
              Experience Unforgettable Moments.
            </h4>

            <div>
              {userHa && (
                <button
                  className="bg-primary px-5 text-2xl py-2 rounded shadow-sm hover:bg-secondary shadow-black text-white flex items-center gap-2"
                  onClick={() => {
                    router.push("/createEvent");
                  }}
                >
                  Create Events
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-center my-2">Top Events</h1>

      <Swiper
        // effect={"coverflow"}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper h-[25rem]"
        // className="flex flex-wrap justify-center gap-2 mt-4"
      >
        {events &&
          events.map((event, index) => {
            return (
              <SwiperSlide>
                <EventCard key={index} event={event} swiper={true} />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};

export default HomeComponent;
