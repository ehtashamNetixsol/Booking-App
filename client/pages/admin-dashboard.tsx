import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import BlogCard from "@/components/EventCard/EventCard";
import Loader from "@/components/Loader";
import PageHeader from "@/components/PageHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const adminDashboardPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setloading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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
  const fetchBlogs = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/blogs/admin`)
      .then((response) => {
        response.data.map((blog: any) => {
          const originalDate = new Date(blog.createdAt);
          const formattedDate = format(originalDate, "MMMM d, yyyy");
          blog.createdAt = formattedDate;
          blog.thumbnail = `uploads/${blog.thumbnail.replace(/^.*[\\\/]/, "")}`;
          return blog;
        });
        setBlogs(response.data);
        setloading(false);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  };
  const fetchBlogsByFilters = async (category: string, status: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/blogs/admin?category=${category}&status=${status}`
      );
      if (response.data) {
        response.data.map((blog: any) => {
          const originalDate = new Date(blog.createdAt);
          const formattedDate = format(originalDate, "MMMM d, yyyy");
          blog.createdAt = formattedDate;
          blog.thumbnail = `uploads/${blog.thumbnail.replace(/^.*[\\\/]/, "")}`;
          return blog;
        });
        setBlogs(response.data);
        setloading(false);
        // console.log("categoreis", response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
      toast.error("error fetching blogs");
    }
  };
  useEffect(() => {
    setloading(true);
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedStatus) {
      setloading(true);
      console.log(selectedCategory, selectedStatus);
      fetchBlogsByFilters(selectedCategory, selectedStatus);
    } else {
      setloading(true);
      fetchBlogs();
    }
    fetchCategories();
  }, [selectedCategory, selectedStatus]);

  return (
    <AdminProtectedRoute>
      <div className="container mx-auto py-10 min-h-screen">
        <PageHeader heading="Admin Dashboard" link="Home >> admin-dashboard" />
        <div className="w-full bg-gray-400 flex items-center gap-2 flex-wrap justify-center py-2">
          <select
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
          </select>
          <select
            className="border rounded py-2 px-3 text-black dark:text-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="unapproved">Unapproved</option>
          </select>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default ProtectedRoute(adminDashboardPage);
