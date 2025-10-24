"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProfileService, { ProfileAPI } from "../../api/profile/profile";
import ConstituencyService from "../../api/constituency/constituency";

interface Constituency {
  id: number;
  name: string;
}

const TableProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileAPI | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileAPI>>({});
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = 12;

  const getMessage = (message: string | Record<string, string[]> | undefined) => {
    if (!message) return "Something went wrong";
    if (typeof message === "string") return message;
    return Object.values(message).flat().join("\n");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await ProfileService.getProfileById(userId);
      if (result.status === "success") {
        setProfileInfo(result.data);
        setFormData(result.data);
      } else {
        Swal.fire({
          title: "Error!",
          text: getMessage(result.message),
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
      setLoading(false);
    };

    const handleGetConstituencies = async () => {
      try {
        const response = await ConstituencyService.getConstituencies();
        setConstituencies(response);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
      }
    };

    fetchProfile();
    handleGetConstituencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (["first_name", "last_name", "email"].includes(name)) {
      setFormData({
        ...formData,
        user: { ...formData.user, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "Updating Profile...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const payload = { ...formData };
    if (payload.user) {
      const { username, ...userWithoutUsername } = payload.user;
      payload.user = userWithoutUsername;
    }

    const result = await ProfileService.updateProfile(userId, payload);
    Swal.close();

    if (result.status === "success") {
      setProfileInfo(result.data);
      setIsModalOpen(false);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Update Failed",
        text: getMessage(result.message),
        icon: "error",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <>
      {/* Full-width Profile Section */}
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl border border-gray-200">
          {/* Cover Photo */}
          <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-2xl">
            <img
              src="/cover.jpeg"
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <img
                src="/profile.jpeg"
                alt="Profile"
                className="rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16 text-center p-6">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
              {profileInfo
                ? `${profileInfo.user.first_name} ${profileInfo.user.last_name}`
                : "Loading..."}
            </h3>
            <span className="text-sm text-gray-500">{profileInfo?.role || "User"}</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700 mt-6">
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm">{profileInfo?.user.email || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-sm">{profileInfo?.phone || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Constituency</h4>
                <p className="text-sm">
                  {constituencies.find((c) => c.id === profileInfo?.constituency)?.name || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Role</h4>
                <p className="text-sm">{profileInfo?.role || "N/A"}</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-5 py-2 rounded-full text-sm font-medium text-white bg-green-700 hover:bg-green-800 shadow transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">Edit Profile</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {[
                { label: "First Name", name: "first_name", value: formData.user?.first_name || "" },
                { label: "Last Name", name: "last_name", value: formData.user?.last_name || "" },
                { label: "Email", name: "email", value: formData.user?.email || "" },
                { label: "Phone", name: "phone", value: formData.phone || "" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.name === "email" ? "email" : "text"}
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constituency
                </label>
                <select
                  name="constituency"
                  value={formData.constituency || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Select Constituency</option>
                  {constituencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TableProfile;
