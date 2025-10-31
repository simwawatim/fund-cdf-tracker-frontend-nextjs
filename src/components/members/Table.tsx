"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import MemberService, { CreateMemberPayload } from "../../api/member/member";
import ConstituencyService from "../../api/constituency/constituency";

interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  constituency: number;
  phone: string;
  image: string;
}

interface Constituency {
  id: number;
  name: string;
}

interface FormData extends Member {}

const MembersTable = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    constituency: 0,
    phone: "",
    image: "default-profile.png",
  });

  const USER_ROLES = [
    { value: "admin", label: "Admin" },
    { value: "officer", label: "Officer" },
    { value: "viewer", label: "Viewer" },
  ];

  // Fetch constituencies
  const handleGetConstituencies = async () => {
    try {
      const response = await ConstituencyService.getConstituencies();
      setConstituencies(response);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
      Swal.fire("Error", "Failed to fetch constituencies", "error");
    }
  };

  // Fetch members
  const fetchMembers = async () => {
    try {
      const data = await MemberService.getMembers();
      const mappedMembers: Member[] = data.map((m: any) => ({
        id: m.id,
        firstName: m.user.first_name,
        lastName: m.user.last_name,
        email: m.user.email,
        role: m.role,
        constituency: m.constituency ?? 0,
        phone: m.phone,
        image: "default-profile.png",
      }));
      setMembers(mappedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire("Error", "Failed to fetch members", "error");
    }
  };

  useEffect(() => {
    handleGetConstituencies();
    fetchMembers();
  }, []);

  // Open modals
  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      constituency: 0,
      phone: "",
      image: "default-profile.png",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  // Delete member
  const handleDelete = async (member: Member) => {
    if (!member.id) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const response = await MemberService.deleteMember(member.id);
      if (response.status === "success") {
        setMembers(members.filter((m) => m.id !== member.id));
        Swal.fire("Deleted!", "Member has been deleted.", "success");
      } else {
        Swal.fire(
          "Error",
          typeof response.message === "string"
            ? response.message
            : JSON.stringify(response.message),
          "error"
        );
      }
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role ||
      !formData.constituency ||
      !formData.phone
    ) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Invalid email address", "error");
      return;
    }

    const phoneRegex = /^[0-9+()\s-]+$/;
    if (!phoneRegex.test(formData.phone)) {
      Swal.fire("Error", "Invalid phone number", "error");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateMemberPayload = {
        user: {
          username: formData.firstName.toUpperCase(),
          email: formData.email.toLowerCase(),
          first_name: formData.firstName.toLowerCase(),
          last_name: formData.lastName.toLowerCase(),
        },
        role: formData.role,
        phone: formData.phone,
        constituency: formData.constituency,
      };

      if (editingMember && editingMember.id) {
        const response = await MemberService.updateMember(editingMember.id, payload);
        if (response.status === "success") {
          Swal.fire("Success", "Member updated successfully!", "success");
          setMembers(
            members.map((m) =>
              m.id === editingMember.id ? { ...formData, id: editingMember.id } : m
            )
          );
          setIsModalOpen(false);
        } else {
          Swal.fire(
            "Error",
            typeof response.message === "string"
              ? response.message
              : JSON.stringify(response.message),
            "error"
          );
        }
      } else {
        const response = await MemberService.createMember(payload);
        if (response.status === "success") {
          Swal.fire("Success", "Member created successfully!", "success");
          const created: any = response.data ?? {};
          setMembers([
            ...members,
            {
              id: created.id ?? undefined,
              firstName:
                created.first_name ?? payload.user.first_name ?? formData.firstName,
              lastName:
                created.last_name ?? payload.user.last_name ?? formData.lastName,
              email: created.email ?? payload.user.email ?? formData.email,
              role: created.role ?? formData.role,
              phone: created.phone ?? formData.phone,
              constituency:
                created.constituency ?? payload.constituency ?? formData.constituency ?? 0,
              image: "default-profile.png",
            },
          ]);
          setIsModalOpen(false);
        } else {
          Swal.fire(
            "Error",
            typeof response.message === "string"
              ? response.message
              : JSON.stringify(response.message),
            "error"
          );
        }
      }
    } catch (error: any) {
      console.error("Error creating/updating member:", error);
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Search filter
  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.firstName.toLowerCase().includes(term) ||
      member.lastName.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Members Table</h1>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={openAddModal}
          className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black"
        >
          Add User
        </button>

        <input
          type="text"
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mblockt-2  rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">No</th>
              <th className="text-left py-3 px-6">Profile</th>
              <th className="text-left py-3 px-6">First Name</th>
              <th className="text-left py-3 px-6">Last Name</th>
              <th className="text-left py-3 px-6">Email</th>
              <th className="text-left py-3 px-6">Role</th>
              <th className="text-left py-3 px-6">Constituency</th>
              <th className="text-left py-3 px-6">Phone</th>
              <th className="text-left py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member, index) => (
              <tr key={member.id || index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-black">{member.id}</td>
                <td className="py-3 px-6">
                  <img
                    src={member.image}
                    alt={member.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-6 text-black">{member.firstName}</td>
                <td className="py-3 px-6 text-black">{member.lastName}</td>
                <td className="py-3 px-6 text-black">{member.email}</td>
                <td className="py-3 px-6 text-black">{member.role}</td>
                <td className="py-3 px-6 text-black">
                  {constituencies.find((c) => c.id === member.constituency)?.name || "N/A"}
                </td>
                <td className="py-3 px-6 text-black">{member.phone}</td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${
              currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300"
        >
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
              {["firstName", "lastName", "email", "phone"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  disabled={isLoading}
                />
              ))}

              {/* Role Dropdown */}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select Role
                </option>
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              {/* Constituency Dropdown */}
              <select
                value={formData.constituency}
                onChange={(e) =>
                  setFormData({ ...formData, constituency: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isLoading}
              >
                <option value={0} disabled>
                  Select Constituency
                </option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : editingMember ? "Update" : "Add"}
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
