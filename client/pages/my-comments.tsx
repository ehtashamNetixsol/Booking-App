import Loader from "@/components/Loader";
import PageHeader from "@/components/PageHeader";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const MyCommentsPage = () => {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [editedComment, setEditedComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [commentIdToEdit, setCommentIdToEdit] = useState("");
  const fetchMyComments = async () => {
    const userLocal = localStorage.getItem("user");
    const user = userLocal !== null ? JSON.parse(userLocal) : null;
    const userId = user ? user.userId : null;

    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.get(`comments/mycomments/${userId}`);
      if (resp.data) {
        setComments(resp.data);
        // console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  const handleEdit = (commentId: string, content: string) => {
    setIsEditing(true);
    setCommentIdToEdit(commentId);
    setEditedComment(content);
  };

  const handleEditComment = async (e: any) => {
    e.preventDefault();
    // console.log(editedComment);
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.put(`/comments/${commentIdToEdit}`, {
        commentText: editedComment,
      });

      if (resp.data.success) {
        toast.success(resp.data.message);
        setIsEditing(false); // Close the modal
        fetchMyComments();
      }
    } catch (error) {
      // Handle error and show error toast
      toast.error("Error editing comment");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const axiosInstance = getToken();
      const resp = await axiosInstance.delete(`/comments/${id}`);

      if (resp.data.success) {
        toast.success(resp.data.message);
        fetchMyComments();
      }
      //   fetchAllChallenges();
    } catch (error) {
      // Handle error and show error toast
      toast.error("Error deleting Comment");
    }
  };
  return (
    <div className="container mx-auto my-10">
      <PageHeader heading="My Comments" link="Home>> my-comments" />
      <div>
        {comments ? (
          comments.map((comment: any) => (
            <div key={comment._id} className="mb-4">
              <h3>BlogName: {comment.blogId.title}</h3>
              <p className="font-semibold text-gray-700">
                Comment By: {Capitalize(comment.authorId.username)}:
              </p>
              <p className="text-gray-600">comment: {comment.commentText}</p>
              <div className={` mt-4 flex gap-2}`}>
                <button
                  className={`bg-primary text-white px-4 py-2 mx-2 rounded hover:bg-secondary`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(comment._id, comment.commentText);
                  }}
                >
                  Edit
                </button>
                {isEditing && (
                  <div className="fixed inset-0 flex items-center justify-center z-10 bg-opacity-50 bg-gray-800">
                    <div className="bg-white p-6 rounded shadow-md w-64">
                      <h2 className="text-lg font-semibold mb-4">
                        Edit Comment Content
                      </h2>
                      <form onSubmit={handleEditComment}>
                        <input
                          type="text"
                          className="w-full border rounded p-2 mb-2"
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          required
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="mr-2 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <button
                  className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(comment._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
function Capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export default MyCommentsPage;
