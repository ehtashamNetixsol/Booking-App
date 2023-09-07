import { NewBlog } from "@/Schema";
import React from "react";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import WriterProtectedRoute from "@/components/WriterProtectedRoute";
import EventForm from "@/components/EventForm";

const CreateBlogPage = () => {
  return (
    <div className="sm:container mx-3 sm:mx-auto my-10">
      <PageHeader heading="Create a New Event" link="Home >> createEvent" />
      <EventForm />
    </div>
  );
};

export default ProtectedRoute(CreateBlogPage);
