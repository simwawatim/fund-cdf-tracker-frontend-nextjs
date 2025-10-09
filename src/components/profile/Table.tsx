"use client";

import { useState } from "react";
import ProfileProject from "./ProfileProject";

const TableProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {/* Profile Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-5 text-black">
                Profile Overview
              </h2>

              <div className="flex flex-col items-center mb-6">
                <img
                  src="/default-profile.png"
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-green-700 shadow-md mb-4"
                />
                <h3 className="text-lg font-semibold text-black">
                  Helene Engels
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  PRO Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">
                      Email
                    </h4>
                    <p className="text-sm text-gray-700">
                      helene@example.com
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">
                      Home Address
                    </h4>
                    <p className="text-sm text-gray-700">
                      2 Miles Drive, NJ 071, New York, USA
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">
                      Phone
                    </h4>
                    <p className="text-sm text-gray-700">
                      +1234 567 890 / +12 345 678
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">
                      Favorite Pick-up Point
                    </h4>
                    <p className="text-sm text-gray-700">
                      Herald Square, 2, New York, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
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
            <h2 className="text-2xl font-semibold mb-6 text-black pb-2">
              CDF Statistics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-black mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-black">
                      {item.value}
                    </span>
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

      {/* Projects */}
   
        <ProfileProject />
   
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-black">
              Edit Profile
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Helene Engels"
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="helene@example.com"
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+1234 567 890"
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Address
                </label>
                <textarea
                  defaultValue="2 Miles Drive, NJ 071, New York, USA"
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                ></textarea>
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
