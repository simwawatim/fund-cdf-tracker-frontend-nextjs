"use client";

import AuthService, { ErrorLoginResponse, SuccessLoginResponse } from "../../api/login/login";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const LoginComp = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginResponse: SuccessLoginResponse = await AuthService.login(email, password);
      localStorage.setItem("access_token", loginResponse.access);
      router.push("/home");

    } catch (err) {
      const error = err as ErrorLoginResponse;
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Image Section */}
      <div
        className="hidden md:flex md:w-8/12 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.squarespace-cdn.com/content/v1/539712a6e4b06a6c9b892bc1/1602606346823-O1E85ROA1WY8GUA1KZEJ/5164447705_8b60b18201_o.jpg')",
        }}
      >
        <img
          src="/cdf-logo-2.png"
          alt="Overlay"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-4/12 flex items-center justify-center p-6">
        <div className="w-full bg-white shadow-2xl rounded-2xl p-10 sm:p-12 relative">

          {/* Zambian Flag */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-16 h-10 rounded overflow-hidden shadow-lg">
            <img src="/zambia-flag.png" alt="Zambian Flag" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-6">Sign in</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Enter your credentials to access your account</p>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L4 20v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginComp;
