import React, { useEffect, useState } from "react";
import { NewBlog } from "@/Schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { DynamicEditorProps } from "@/types";
import axios from "axios";
import { getToken } from "@/utils/getToken";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { formatDateToISO, formatDateToString } from "@/utils/formatDate";

export const DynamicEditor: React.FC<DynamicEditorProps> = ({
  onEditorChange,
  content,
}) => {
  return (
    <Editor
      value={content}
      apiKey={process.env.NEXT_PUBLIC_TINYKEY}
      onEditorChange={onEditorChange}
      init={{
        content_css: "../styles/tinymceStyles.css",
        height: 300,
        plugins:
          "image imageupload preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
        menubar: "file edit view insert format tools table",
        toolbar:
          "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
        toolbar_sticky: true,
        // toolbar_sticky_offset: isSmallScreen ? 102 : 108,
        file_picker_callback(callback, value, meta) {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = function () {
            const file = input.files && input.files[0];

            if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                const dataUrl = e.target!.result as string;
                const blobInfo = {
                  blobUri: dataUrl,
                  alt: "My alt text", // Set the alt text here
                };
                callback(dataUrl, blobInfo);
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        },
      }}
    />
  );
};

const EventForm = ({ isEditing = false, eventData = {} }: any) => {
  // console.log("blogform--------", eventData);
  const [content, setcontent] = useState(eventData.description || "");
  const [picError, setpicError] = useState("");
  const [loading, setloading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showOldImage, setshowOldImage] = useState(isEditing ? true : false);
  const [thumbnailPic, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    eventData.thumbnail || null
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(NewBlog),
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/categories`
      );
      setCategories(response.data);
      setloading(false);
    } catch (error) {
      toast.error("error fetching categories");
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    // setloading(true);
    // fetchCategories();
  }, []);
  useEffect(() => {
    if (isEditing && eventData) {
      // Pre-fill form fields with existing blog data
      setValue("title", eventData.title);
      setValue("location", eventData.location);
      setValue("time", eventData.time);
      setcontent(eventData.description);

      // change date format to set it in input
      // const formatedDateISO = new Date(formatDateToISO(eventData.date));
      setValue("date", eventData.date);
      // setValue("selectedCategory", eventData.category._id);
    }
  }, [isEditing, eventData]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setThumbnail(selectedFile);
    if (selectedFile) {
      setpicError("");
      // Create a temporary URL for the selected image
      const imageUrl = URL.createObjectURL(selectedFile);
      setThumbnailUrl(imageUrl);
      setshowOldImage(false);
    } else {
      setThumbnailUrl(eventData.thumbnail || null);
    }
  };

  const onsubmit = async (data: any) => {
    if (!isEditing) {
      if (thumbnailPic) {
        data.thumbnail = thumbnailPic;
      } else {
        return setpicError("Cover Image is required");
      }
    }
    // data.date = formatDateToString(data.date);
    // console.log(data);

    const Data = new FormData();
    Data.append("title", data.title);
    Data.append("description", content);
    Data.append("date", data.date);
    Data.append("time", data.time);
    Data.append("location", data.location);
    // Data.append("category", data.selectedCategory);
    if (thumbnailPic) {
      Data.append("thumbnail", thumbnailPic);
    } else {
      Data.append("thumbnail", eventData.thumbnail);
    }

    // Data.forEach((item) => console.log(item));

    // send data to backend

    // isEditing true then put, else post
    if (isEditing) {
      const axiosInstance = getToken();
      const resp = await axiosInstance.put(`/events/${eventData._id}`, Data);
      if (resp.data.success) {
        console.log(resp.data);
        toast.success(resp.data.message);
        router.push("/user-dashboard");
      } else {
        toast.error(resp.data.message);
      }
      try {
      } catch (error) {
        const knownError = error as Error;
        toast.error(knownError.message);
      }
    } else {
      try {
        const axiosInstance = getToken();
        const resp = await axiosInstance.post(`/events/new`, Data);

        if (resp.data.success) {
          // console.log(resp.data);
          toast.success(resp.data.message);
          router.push("/user-dashboard");
        } else {
          toast.error(resp.data.message);
        }
      } catch (error) {
        const knownError = error as Error;
        toast.error(knownError.message);
      }
    }
  };

  const handleEditorChange = (editorContent: string) => {
    // console.log(editorContent)
    setcontent(editorContent);
  };

  if (loading) return <Loader />;
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">Write a Title</label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3"
          {...register("title")}
          name="title"
        />
        {errors.title && (
          <span className="text-red-600 text-sm">{errors.title.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">
          Upload a Cover Image
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="border py-2 px-3"
            name="file"
            onChange={handleThumbnailChange}
          />
          {picError && <span className="text-red-600 text-sm">{picError}</span>}
        </div>
        {thumbnailUrl && (
          <img
            src={
              showOldImage
                ? `${process.env.NEXT_PUBLIC_BACKEND}/${thumbnailUrl}`
                : thumbnailUrl
            }
            alt="Cover Image"
            className="w-48 shadow-md shadow-black dark:shadow-gray-600 my-2 block mx-auto"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">Event Date</label>
        <input
          type="date"
          className="border rounded w-full py-2 px-3"
          {...register("date")}
          name="date"
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.date && (
          <span className="text-red-600 text-sm">Event Date is required</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">Event Time</label>
        <input
          type="time"
          className="border rounded w-full py-2 px-3"
          {...register("time")}
          name="time"
        />
        {errors.time && (
          <span className="text-red-600 text-sm">{errors.time.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">Event Location</label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3"
          {...register("location")}
          name="location"
        />
        {errors.location && (
          <span className="text-red-600 text-sm">
            {errors.location.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xl font-bold mb-2">
          Event Description
        </label>
        <DynamicEditor onEditorChange={handleEditorChange} content={content} />
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isEditing ? "Edit Event" : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;
