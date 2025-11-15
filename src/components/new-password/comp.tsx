"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import BASE_API_URL from "../../api/base/base";

interface Props {
  uid: string;
  token: string;
}

const NewPasswordComp: React.FC<Props> = ({ uid, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return Swal.fire({ title: "Error", text: "Password must be at least 6 characters.", icon: "error" });
    }
    if (password !== confirmPassword) {
      return Swal.fire({ title: "Error", text: "Passwords do not match.", icon: "error" });
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/password-reset-confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({ title: "Success", text: data.detail || "Password reset successfully!", icon: "success" })
          .then(() => router.push("/login"));
      } else {
        Swal.fire({ title: "Failed", text: data.password ? data.password[0] : data.detail || "Something went wrong.", icon: "error" });
      }
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err.message || "Something went wrong.", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Image Section */}
      <div
        className="hidden md:flex md:w-8/12 relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/539712a6e4b06a6c9b892bc1/1602606346823-O1E85ROA1WY8GUA1KZEJ/5164447705_8b60b18201_o.jpg')" }}
      >
        <img src="/cdf-logo-2.png" alt="Overlay" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-auto rounded-lg shadow-lg" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-4/12 flex items-center justify-center p-6">
        <div className="w-full bg-white shadow-2xl rounded-2xl p-10 sm:p-12 relative">

          {/* Zambian Flag */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-16 h-10 rounded overflow-hidden shadow-lg">
            <img src="/zambia-flag.png" alt="Zambian Flag" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-6">Set New Password</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Enter a new password to reset your account password</p>

          <form onSubmit={handleNewPasswordSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L4 20v-4a8 8 0 01-8-8z"></path>
                </svg>
              ) : (
                "Set Password"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default NewPasswordComp;
