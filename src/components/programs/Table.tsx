"use client";

import { useState } from "react";

// -------------------- CDF Categories Data --------------------
interface CDFCategory {
  name: string;
  description: string;
  duration: string;
  mode: string;
  coordinator: string;
  contact: string;
}

const initialCategories: CDFCategory[] = [
  { name: "IT Training", description: "Basic and advanced IT skills", duration: "6-12 Weeks", mode: "Online/Onsite", coordinator: "Alice Smith", contact: "+260 955 123456" },
  { name: "Health Programs", description: "Community health and hygiene", duration: "8 Weeks", mode: "Onsite", coordinator: "Bob Johnson", contact: "+260 955 654321" },
  { name: "Agriculture Skills", description: "Farming and livestock management", duration: "10 Weeks", mode: "Onsite", coordinator: "Carol Lee", contact: "+260 977 112233" },
];

// -------------------- CDF Categories Table --------------------
const CDFCategoriesTable = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CDFCategory | null>(null);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const [formData, setFormData] = useState<CDFCategory>({
    name: "",
    description: "",
    duration: "",
    mode: "",
    coordinator: "",
    contact: "",
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", duration: "", mode: "", coordinator: "", contact: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: CDFCategory) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map((c) => (c === editingCategory ? formData : c)));
    } else {
      setCategories([...categories, formData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">CDF Programs Offered</h1>

      <div className="mb-4">
        <button onClick={openAddModal} className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black">
          Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">Category Name</th>
              <th className="text-left py-3 px-6">Description</th>
              <th className="text-left py-3 px-6">Duration</th>
              <th className="text-left py-3 px-6">Mode</th>
              <th className="text-left py-3 px-6">Coordinator</th>
              <th className="text-left py-3 px-6">Contact</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{category.name}</td>
                <td className="py-3 text-black px-6">{category.description}</td>
                <td className="py-3 text-black px-6">{category.duration}</td>
                <td className="py-3 text-black px-6">{category.mode}</td>
                <td className="py-3 text-black px-6">{category.coordinator}</td>
                <td className="py-3 text-black px-6">{category.contact}</td>
                <td className="py-3 text-black px-6">
                  <button onClick={() => openEditModal(category)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-96 p-6 relative text-black">
            <h2 className="text-2xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field as keyof CDFCategory]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-black"
                  required
                />
              ))}
              <div className="flex justify-end space-x-2 mt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black">
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
