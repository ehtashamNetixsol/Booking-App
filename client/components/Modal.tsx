import React from "react";

interface ModalProps {
  handleUpdateCategory: (e: React.FormEvent) => void;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditingCategory: React.Dispatch<
    React.SetStateAction<{ id: string; title: string } | null>
  >;
}

const Modal = ({
  handleUpdateCategory,
  newTitle,
  setNewTitle,
  setEditingCategory,
}: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-opacity-50 bg-gray-800">
      <div className="bg-white p-6 rounded shadow-md w-64">
        <h2 className="text-lg font-semibold mb-4">Edit Category Title</h2>
        <form onSubmit={handleUpdateCategory}>
          <input
            type="text"
            className="w-full border rounded p-2 mb-2"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-700"
              onClick={() => setEditingCategory(null)}
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
  );
};

export default Modal;
