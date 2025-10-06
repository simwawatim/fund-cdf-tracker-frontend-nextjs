"use client";

import { useEffect, useState } from "react";
import ConstituencyService from "../../api/constituency/constituency";
import Swal from "sweetalert2";

interface Constituency {
  id?: number;
  name: string;
  province: string;
  constituency_code?: string;
  created_at?: string;
}

const ConstituencyTable = () => {
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState<Constituency | null>(null);
  const [formData, setFormData] = useState<Constituency>({ name: "", province: "" });

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConstituencies = constituencies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(constituencies.length / itemsPerPage);

  useEffect(() => {
    handleGetConstituencies();
  }, []);

  const handleGetConstituencies = async () => {
    try {
      const response = await ConstituencyService.getConstituencies();
      const mapped: Constituency[] = response.map(item => ({
        id: item.id,
        name: item.name,
        province: item.district,
        constituency_code: item.constituency_code,
        created_at: item.created_at,
      }));
      setConstituencies(mapped);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
      Swal.fire("Error", "Failed to fetch constituencies", "error");
    }
  };

  const openAddModal = () => {
    setEditingConstituency(null);
    setFormData({ name: "", province: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Constituency) => {
    setEditingConstituency(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingConstituency?.id) {

      try {
        const response = await ConstituencyService.updateConstituency(
          editingConstituency.id,
          formData.name,
          formData.province,
        );

        if (response.status === "success") {
          Swal.fire("Success!", "Constituency updated successfully!", "success");
          handleGetConstituencies();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      } catch (error) {
        console.error("Error updating constituency:", error);
        Swal.fire("Error!", "Failed to update constituency.", "error");
      }
    } else {

      try {
        const response = await ConstituencyService.createConstituency(formData.name, formData.province);
        if (response.status === "success") {
          Swal.fire("Success!", "Constituency added successfully!", "success");
          handleGetConstituencies();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      } catch (error) {
        console.error("Error adding constituency:", error);
        Swal.fire("Error!", "Failed to add constituency.", "error");
      }
    }

    setIsModalOpen(false);
  };
  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        const response = await ConstituencyService.deleteConstituency(id);
        if (response.status === "success") {
          Swal.fire("Deleted!", "Constituency deleted successfully.", "success");
          handleGetConstituencies();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      } catch (error) {
        console.error("Error deleting constituency:", error);
        Swal.fire("Error!", "Failed to delete constituency.", "error");
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-ZM", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Constituencies Table</h1>

      <div className="mb-4">
        <button onClick={openAddModal} className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black">
          Add Constituency
        </button>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <td className="text-left py-3 px-6"> Code </td>
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Province</th>
              <th className="text-left py-3 px-6">Created On</th>
              <th className="text-left py-3 px-6">Edit</th>

            </tr>
          </thead>
          <tbody>
            {currentConstituencies.map((c, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{c.constituency_code}</td>
                <td className="py-3 text-black px-6">{c.name}</td>
                <td className="py-3 text-black px-6">{c.province}</td>
                <td className="py-3 text-black px-6">{formatDate(c.created_at)}</td>

                
                <td className="py-3 text-black px-6 space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">Next</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-96 p-6 relative text-black overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">{editingConstituency ? "Edit Constituency" : "Add Constituency"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />

              <select
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              >
                <option value="">Select Province</option>
                <option value="Lusaka">Lusaka</option>
                <option value="Copperbelt">Copperbelt</option>
                <option value="Southern">Southern</option>
                <option value="Central">Central</option>
                <option value="Northwestern">Northwestern</option>
              </select>

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black"
                >
                  {editingConstituency ? "Update" : "Add"}
                </button>
              </div>
            </form>


          </div>
        </div>
      )}
    </div>
  );
};

export default ConstituencyTable;
