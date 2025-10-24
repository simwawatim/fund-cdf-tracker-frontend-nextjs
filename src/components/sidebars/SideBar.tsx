"use client";

import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaSchool,
  FaUser,
  FaSignOutAlt,
  FaProjectDiagram,
  FaExchangeAlt,
} from "react-icons/fa";

const SidebarComp = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <nav className="bg-black h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4">
      {/* Logo */}
      <div className="text-white text-2xl font-bold mb-6">CDF System</div>

      {/* Menu */}
      <div className="overflow-auto py-2 h-full">
        <ul className="space-y-2">
          <li>
            <a
              href="/home"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/members"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaChalkboardTeacher />
              <span>Members</span>
            </a>
          </li>
          <li>
            <a
              href="/constituency"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaSchool />
              <span>Constituency</span>
            </a>
          </li>
          <li>
            <a
              href="/projects"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaExchangeAlt />
              <span>Projects</span>
            </a>
          </li>
          <li>
            <a
              href="/programs"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaProjectDiagram />
              <span>Programs</span>
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaUser />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a
              href="/"
              className="w-full text-left text-white font-medium hover:text-white hover:bg-green-900 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SidebarComp;
