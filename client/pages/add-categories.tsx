import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Modal from "@/components/Modal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const addCategoriesPage = () => {
  const [title, setTitle] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title) {
      return setError("Title is required");
    }

    try {
      setError("");
      const axiosInstance = getToken();
      const response = await axiosInstance.post("/categories/new", { title });
      if (response.data.success) {
        setTitle("");
        console.log(response.data);
        toast.success(response.data.message);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.delete(`/categories/${id}`);
      if (response.status === 200) {
        toast.success(response.data);
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting category");
    }
  };
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      return; // Don't update if the title is empty
    }

    try {
      const axiosInstance = getToken();
      const response = await axiosInstance.put(
        `/categories/${editingCategory?.id}`,
        { title: newTitle }
      );
      if (response.status === 200) {
        toast.success(response.data);
        fetchCategories(); // Refresh the categories list
        setEditingCategory(null); // Close the modal
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating category");
    }
  };

  const handleEditCategory = (category: { _id: string; title: string }) => {
    setEditingCategory({ id: category._id, title: category.title });
    setNewTitle(category.title);
  };

  return (
    <AdminProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Add Categories</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block mb-2">Category Title:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <span className="text-red-500">{error}</span>}
          <div>
            <button
              type="submit"
              className="bg-primary hover:bg-blue-500 text-white rounded mt-2 p-2"
            >
              Add Category
            </button>
          </div>
        </form>
        <h2 className="font-semibold mb-4 text-4xl">Categories List</h2>
        <table className="w-50 shadow-md mx-auto border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="border p-2 ">Category Title</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: { _id: string; title: string }) => (
              <tr key={category._id}>
                <td className="border p-2">{category.title}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  {editingCategory && (
                    <Modal
                      handleUpdateCategory={handleUpdateCategory}
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      setEditingCategory={setEditingCategory}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminProtectedRoute>
  );
};

export default ProtectedRoute(addCategoriesPage);
