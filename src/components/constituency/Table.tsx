"use client";

import { useState } from "react";

// -------------------- Constituencies Data --------------------
interface Constituency {
  name: string;
  province: string;
  population: number;
  representative: string;
  remarks: string;
}

const initialConstituencies: Constituency[] = [
  { name: "Lusaka Central", province: "Lusaka", population: 120000, representative: "John Doe", remarks: "Urban area" },
  { name: "Kitwe West", province: "Copperbelt", population: 90000, representative: "Mary Banda", remarks: "" },
  { name: "Ndola East", province: "Copperbelt", population: 80000, representative: "Peter Mwansa", remarks: "" },
  { name: "Livingstone South", province: "Southern", population: 60000, representative: "Grace Phiri", remarks: "" },
  { name: "Chingola North", province: "Copperbelt", population: 70000, representative: "David Zulu", remarks: "" },
  { name: "Mufulira Central", province: "Copperbelt", population: 50000, representative: "Linda Mwale", remarks: "" },
  { name: "Kabwe East", province: "Central", population: 65000, representative: "Thomas Lungu", remarks: "" },
  { name: "Solwezi West", province: "Northwestern", population: 55000, representative: "Ruth Musonda", remarks: "" },
  { name: "Lusaka North", province: "Lusaka", population: 110000, representative: "Alice Tembo", remarks: "" },
  { name: "Ndola South", province: "Copperbelt", population: 75000, representative: "Kennedy Phiri", remarks: "" },
];

// -------------------- Constituency Table Component --------------------
const ConstituencyTable = () => {
  const [constituencies, setConstituencies] = useState(initialConstituencies);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState<Constituency | null>(null);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConstituencies = constituencies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(constituencies.length / itemsPerPage);

  const [formData, setFormData] = useState<Constituency>({
    name: "",
    province: "",
    population: 0,
    representative: "",
    remarks: "",
  });

  const openAddModal = () => {
    setEditingConstituency(null);
    setFormData({ name: "", province: "", population: 0, representative: "", remarks: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (constituency: Constituency) => {
    setEditingConstituency(constituency);
    setFormData({ ...constituency });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingConstituency) {
      setConstituencies(constituencies.map(c => (c === editingConstituency ? formData : c)));
    } else {
      setConstituencies([...constituencies, formData]);
    }
    setIsModalOpen(false);
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
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Province</th>
              <th className="text-left py-3 px-6">Population</th>
              <th className="text-left py-3 px-6">Representative</th>
              <th className="text-left py-3 px-6">Remarks</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentConstituencies.map((c, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{c.name}</td>
                <td className="py-3 text-black px-6">{c.province}</td>
                <td className="py-3 text-black px-6">{c.population.toLocaleString()}</td>
                <td className="py-3 text-black px-6">{c.representative}</td>
                <td className="py-3 text-black px-6">{c.remarks}</td>
                <td className="py-3 text-black px-6">
                  <button onClick={() => openEditModal(c)} className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
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
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-96 p-6 relative text-black overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">{editingConstituency ? "Edit Constituency" : "Add Constituency"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.keys(formData).map(field => (
                <input
                  key={field}
                  type={field === "population" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                  value={formData[field as keyof Constituency]}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      [field]: field === "population" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded text-black"
                  required
                />
              ))}
              <div className="flex justify-end space-x-2 mt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black">
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
