"use client";

import {
  FaUsers,
  FaProjectDiagram,
  FaSchool,
  FaTasks,
  FaClipboardCheck,
  FaEnvelope,
} from "react-icons/fa";

const HomeCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaUsers className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Total Members</h3>
          <p className="text-3xl font-bold text-white">1,250</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaProjectDiagram className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Active Projects</h3>
          <p className="text-3xl font-bold text-white">85</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaSchool className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Constituencies</h3>
          <p className="text-3xl font-bold text-white">15</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaTasks className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Programs</h3>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
      </div>

      {/* Card 5 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaClipboardCheck className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Pending Approvals</h3>
          <p className="text-3xl font-bold text-white">7</p>
        </div>
      </div>

      {/* Card 6 */}
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaEnvelope className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Messages</h3>
          <p className="text-3xl font-bold text-white">23</p>
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
