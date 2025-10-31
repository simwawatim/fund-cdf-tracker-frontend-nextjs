"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProfileService, { ProfileAPI } from "../../api/profile/profile";
import ConstituencyService from "../../api/constituency/constituency";
import BASE_API_URL from "@/api/base/base";

interface Constituency {
  id: number;
  name: string;
}

const TableProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileAPI | null>(null);
  const [formData, setFormData] = useState<
    Partial<Omit<ProfileAPI, "user">> & {
      user?: Partial<ProfileAPI["user"]>;
      profile_picture?: File | string | null;
      cover_picture?: File | string | null;
    }
  >({});
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);

  const userId = 12;
  const profilerId = 14;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      const file = files[0];
      if (name === "profile_picture") setPreviewProfile(URL.createObjectURL(file));
      if (name === "cover_picture") setPreviewCover(URL.createObjectURL(file));
      setFormData({ ...formData, [name]: file });
    } else if (["first_name", "last_name", "email"].includes(name)) {
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

    const payload = new FormData();

    if (formData.user) {
      payload.append("first_name", formData.user.first_name || "");
      payload.append("last_name", formData.user.last_name || "");
      payload.append("email", formData.user.email || "");
    }

    if (formData.phone) payload.append("phone", formData.phone);
    if (formData.constituency) payload.append("constituency", formData.constituency.toString());

    // type guard to allow safe narrowing to File for instanceof checks
    const isFile = (v: unknown): v is File => v instanceof File;

    if (isFile(formData.profile_picture)) {
      payload.append("profile_picture", formData.profile_picture);
    }

    if (isFile(formData.cover_picture)) {
      payload.append("cover_picture", formData.cover_picture);
    }

    const result = await ProfileService.updateProfile(profilerId, payload as any); // your service can accept FormData
    Swal.close();

    if (result.status === "success") {
      setProfileInfo(result.data);
      setIsModalOpen(false);
      setPreviewProfile(null);
      setPreviewCover(null);
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
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="relative w-full h-60 md:h-72 bg-gray-200">
            <img
              src={
                profileInfo?.cover_picture
                  ? `${BASE_API_URL}${profileInfo.cover_picture}`
                  : "http://127.0.0.1:8000/media/profiles/default_cover.jpg"
              }
              alt="Cover"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />

            {/* Profile Picture */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-70px]">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[5px] border-white shadow-2xl bg-white hover:scale-105 transition-transform duration-300">
                <img
                  src={
                    profileInfo?.profile_picture
                      ? `${BASE_API_URL}${profileInfo.profile_picture}`
                      : "http://127.0.0.1:8000/media/profiles/default_profile.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover object-center rounded-full"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="text-center px-6 pb-10 mt-20">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {profileInfo
                ? `${profileInfo.user.first_name} ${profileInfo.user.last_name}`
                : "Loading..."}
            </h3>
            <span className="text-sm text-gray-500">{profileInfo?.role || "User"}</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700 mt-8">
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
              className="mt-6 px-6 py-2 rounded-full text-sm font-medium text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
              Edit Profile
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Uploads */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-600"
                />
                {previewProfile && (
                  <img
                    src={previewProfile}
                    alt="Preview"
                    className="mt-2 w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Picture
                </label>
                <input
                  type="file"
                  name="cover_picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-600"
                />
                {previewCover && (
                  <img
                    src={previewCover}
                    alt="Preview"
                    className="mt-2 w-full h-32 md:h-40 object-cover rounded-xl border-2 border-gray-300"
                  />
                )}
              </div>

              {/* Text Fields */}
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
