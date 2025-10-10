"use client";

import { useEffect, useState } from "react";
import ProfileProject from "./ProfileProject";
import ProfileService, { ProfileAPI } from "../../api/profile/profile";
import ConstituencyService from "../../api/constituency/constituency";
import Swal from "sweetalert2";

interface Constituency {
  id: number;
  name: string;
}

const TableProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileAPI | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileAPI>>({});
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const userId = 12;

  const getMessage = (message: string | Record<string, string[]> | undefined) => {
    if (!message) return "Something went wrong";
    if (typeof message === "string") return message;
    return Object.values(message).flat().join("\n");
  };

  useEffect(() => {
    const fetchProfile = async () => {
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
    };

    const handleGetConstituencies = async () => {
      try {
        const response = await ConstituencyService.getConstituencies();
        setConstituencies(response);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        Swal.fire("Error", "Failed to fetch constituencies", "error");
      }
    };

    fetchProfile();
    handleGetConstituencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update nested "user" fields properly
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
    console.log("📤 Sending data:", JSON.stringify(formData, null, 2));

    const result = await ProfileService.updateProfile(userId, formData);
    if (result.status === "success") {
      setProfileInfo(result.data);
      setIsModalOpen(false);

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Update Failed",
        text:
          typeof result.message === "string"
            ? result.message
            : getMessage(result.message),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const stats = [
    { title: "Total Projects", value: 48, change: "+12%", positive: true },
    { title: "Completed Projects", value: 30, change: "+8%", positive: true },
    { title: "Ongoing Projects", value: 12, change: "-5%", positive: false },
    { title: "Total Budget Allocated", value: "K25,000,000", change: "+20%", positive: true },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Profile Card */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-200 shadow-lg rounded-2xl p-6 border flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-semibold mb-5 text-black">Profile Overview</h2>

              <div className="flex flex-col items-center mb-6">
                <img
                  src="/default-profile.png"
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-green-700 shadow-md mb-4"
                />
                <h3 className="text-lg font-semibold text-black">
                  {profileInfo ? `${profileInfo.user.first_name} ${profileInfo.user.last_name}` : "Loading..."}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {profileInfo?.role || "User"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">Email</h4>
                    <p className="text-sm text-gray-700">{profileInfo?.user.email || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Constituency</h4>
                    <p className="text-sm text-gray-700">
                      {constituencies.find((c) => c.id === profileInfo?.constituency)?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">Phone</h4>
                    <p className="text-sm text-gray-700">{profileInfo?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Role</h4>
                    <p className="text-sm text-gray-700">{profileInfo?.role || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 mx-auto block rounded-md bg-green-700 hover:bg-green-800 px-4 py-2 text-sm font-medium text-white shadow focus:ring-4 focus:ring-green-300 dark:focus:ring-green-600 transition-all duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* CDF Stats */}
        <div className="w-full lg:flex-1">
          <div className="bg-gray-200 shadow-lg rounded-2xl p-6 border">
            <h2 className="text-2xl font-semibold mb-6 text-black pb-2">CDF Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-black mb-2">{item.title}</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-black">{item.value}</span>
                    <span
                      className={`ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                        item.positive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProfileProject />

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-black">Edit Profile</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-black mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.user?.first_name || ""}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.user?.last_name || ""}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.user?.email || ""}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-700"
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
