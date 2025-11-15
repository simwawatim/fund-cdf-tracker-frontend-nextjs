"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProgramService, { ProgramAPI } from "../../api/program/program";
import { getCurrentUserRole } from "@/api/base/token";

const CDFCategoriesTable = () => {
  const [categories, setCategories] = useState<ProgramAPI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProgramAPI | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const [formData, setFormData] = useState({ name: "", description: "" });
  useEffect(() => {
    setRole(getCurrentUserRole());
  }, []);


  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await ProgramService.getPrograms();
      if (response.status === "success") {
        setCategories(response.data as ProgramAPI[]);
      } else {
        Swal.fire("Error", response.message, "error");
      }
    };
    fetchPrograms();
  }, []);


  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: ProgramAPI) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingCategory) {
      const response = await ProgramService.updateProgram(
        editingCategory.id,
        formData.name,
        formData.description
      );
      if (response.status === "success") {
        Swal.fire("Updated!", "Program updated successfully.", "success");
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? (response.data as ProgramAPI) : c
          )
        );
      } else {
        Swal.fire("Error", response.message, "error");
      }
    } else {
      const response = await ProgramService.createProgram(
        formData.name,
        formData.description
      );
      if (response.status === "success") {
        Swal.fire("Created!", "Program added successfully.", "success");
        setCategories((prev) => [...prev, response.data as ProgramAPI]);
      } else {
        Swal.fire("Error", response.message, "error");
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This program will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const response = await ProgramService.deleteProgram(id);
      if (response.status === "success") {
        Swal.fire("Deleted!", "Program deleted successfully.", "success");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        Swal.fire("Error", response.message, "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">CDF Programs Offered</h1>

      {/* Add button */}
     {role === "admin" && (
        <div className="mb-4">
          <button
            onClick={openAddModal}
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black"
          >
            Add Program
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">Program Name</th>
              <th className="text-left py-3 px-6">Description</th>
               {role === "admin" && (
                <th className="text-left py-3 px-6 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{category.name}</td>
                <td className="py-3 text-black px-6">{category.description}</td>
                 {role === "admin" && (
                  <td className="py-3 px-6 flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-green-900 text-white rounded hover:bg-black"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-3 py-1 bg-green-900 text-white rounded hover:bg-black"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-96 p-6 relative text-black">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? "Edit Program" : "Add Program"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Program Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CDFCategoriesTable;
