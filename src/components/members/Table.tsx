"use client";

import { useState } from "react";

const membersData = [
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member", country: "USA", phone: "+1 555-1234", image: "default-profile.png" },
  { name: "Courtney Henry", title: "Designer", email: "courtney.henry@example.com", role: "Admin", country: "Canada", phone: "+1 555-5678", image: "default-profile.png" },
  { name: "Tom Cook", title: "Director of Product", email: "tom.cook@example.com", role: "Member", country: "UK", phone: "+44 1234-567890", image: "default-profile.png" },
  { name: "Whitney Francis", title: "Copywriter", email: "whitney.francis@example.com", role: "Admin", country: "Australia", phone: "+61 400-123-456", image: "default-profile.png" },
  { name: "Leonard Krasner", title: "Senior Designer", email: "leonard.krasner@example.com", role: "Owner", country: "Germany", phone: "+49 151-12345678", image: "default-profile.png" },
  { name: "Floyd Miles", title: "Principal Designer", email: "floyd.miles@example.com", role: "Member", country: "France", phone: "+33 6 12 34 56 78", image: "default-profile.png" },
];

const MembersTable = () => {
  const [members, setMembers] = useState(membersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    role: "",
    country: "",
    phone: "",
    image: "default-profile.png",
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      title: "",
      email: "",
      role: "",
      country: "",
      phone: "",
      image: "default-profile.png",
    });
    setIsModalOpen(true);
  };

interface Member {
    name: string;
    title: string;
    email: string;
    role: string;
    country: string;
    phone: string;
    image: string;
}

interface FormData extends Member {}

const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
};

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (e: HandleSubmitEvent) => {
    e.preventDefault();
    if (editingMember) {
        // Edit existing member
        setMembers(members.map((m: Member) => (m === editingMember ? formData : m)));
    } else {
        // Add new member
        setMembers([...members, formData]);
    }
    setIsModalOpen(false);
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Members Table</h1>

      <div className="mb-4">
        <button onClick={openAddModal} className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black">
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">Profile</th>
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Title</th>
              <th className="text-left py-3 px-6">Email</th>
              <th className="text-left py-3 px-6">Role</th>
              <th className="text-left py-3 px-6">Country</th>
              <th className="text-left py-3 px-6">Phone</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="py-3 px-6 text-black">{member.name}</td>
                <td className="py-3 px-6 text-black">{member.title}</td>
                <td className="py-3 px-6 text-black">{member.email}</td>
                <td className="py-3 px-6 text-black">{member.role}</td>
                <td className="py-3 px-6 text-black">{member.country}</td>
                <td className="py-3 px-6 text-black">{member.phone}</td>
                <td className="py-3 px-6">
                  <button onClick={() => openEditModal(member)} className="text-blue-600 hover:underline">
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
                <h2 className="text-2xl font-bold mb-4">
                {editingMember ? "Edit Member" : "Add Member"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />
                <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />
                <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />
                <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />
                <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border px-3 py-2 rounded text-black" required />

                <div className="flex justify-end space-x-2 mt-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white">
                    Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black">
                    {editingMember ? "Update" : "Add"}
                    </button>
                </div>
                </form>
            </div>
        </div>


      )}
    </div>
  );
};

export default MembersTable;
