import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ConstituencyService from "../../api/constituency/constituency";
import MemberService, { CreateMemberPayload } from "../../api/member/member";
import { randomBytes } from "crypto";

interface Constituency {
  id: number;
  name: string;
}

const RegisterComp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [constituency, setConstituency] = useState<number>(0);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetConstituencies = async () => {
    try {
      const response = await ConstituencyService.getConstituencies();
      setConstituencies(response);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
      Swal.fire("Error", "Failed to fetch constituencies", "error");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!constituency) {
      Swal.fire("Warning", "Please select a constituency", "warning");
      return;
    }

    const payload: CreateMemberPayload = {
      user: {
        username: firstName.toUpperCase() + Math.floor(Math.random() * 90000),
        email: email.toLowerCase(),
        first_name: firstName.toLowerCase(),
        last_name: lastName.toLowerCase(),
      },
      role: "viewer",
      phone: phone,
      constituency: constituency,
    };

    try {
      setIsLoading(true);
      console.log("Register payload:", payload);

      const response = await MemberService.createMember(payload);
      if (response.status === "success") {
        Swal.fire("Success", "Member created successfully!", "success");
        window.location.href = "/"; 
      } else {
        Swal.fire(
          "Error",
          typeof response.message === "string"
            ? response.message
            : JSON.stringify(response.message),
          "error"
        );
      }
    } catch (err) {
      console.error("Error registering user:", err);
      Swal.fire("Error", "Failed to register user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetConstituencies();
  }, []);

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
            <img
              src="/zambia-flag.png"
              alt="Zambian Flag"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-6">
            Sign up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Create your account to get started
          </p>

          <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="constituency" className="block text-sm font-medium text-gray-700">
                Constituency
              </label>
              <select
                id="constituency"
                value={constituency}
                onChange={(e) => setConstituency(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
            </div>

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
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
                "Sign up"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComp;
