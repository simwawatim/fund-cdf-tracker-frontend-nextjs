"use client";

import { useState } from "react";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaSchool,
  FaUser,
  FaSignOutAlt,
  FaProjectDiagram,
  FaExchangeAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SidebarComp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-black text-white px-4 py-4 shadow-md fixed w-full top-0 left-0 z-40">
        <div className="text-xl font-bold">CDF System</div>
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`bg-black fixed top-0 left-0 h-full min-w-[250px] py-6 px-4 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo (hidden on mobile top bar to avoid duplication) */}
        <div className="text-white text-2xl font-bold mb-6 hidden lg:block">
          CDF System
        </div>

        {/* Menu Items */}
        <div className="overflow-auto py-2 h-full">
          <ul className="space-y-2">
            {[
              { href: "/home", icon: <FaTachometerAlt />, label: "Dashboard" },
              { href: "/members", icon: <FaChalkboardTeacher />, label: "Members" },
              { href: "/constituency", icon: <FaSchool />, label: "Constituency" },
              { href: "/projects", icon: <FaExchangeAlt />, label: "Projects" },
              { href: "/programs", icon: <FaProjectDiagram />, label: "Programs" },
              { href: "/profile", icon: <FaUser />, label: "Profile" },
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}

            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SidebarComp;
