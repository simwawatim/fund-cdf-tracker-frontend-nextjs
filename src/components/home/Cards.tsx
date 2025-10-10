"use client";
import { useEffect, useState } from "react";
import StatsService, { Stats } from "../../api/stats/stats";
import {
  FaUsers,
  FaProjectDiagram,
  FaSchool,
  FaTasks,
  FaClipboardCheck,
  FaEnvelope,
} from "react-icons/fa";
import Swal from "sweetalert2";

const HomeCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await StatsService.getStats();
      if (response.status === "success") {
        // 👇 take the first object from the array
        setStats(response.data[0]);
      } else {
        Swal.fire("Error", response.message, "error");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaUsers className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Total Members</h3>
          <p className="text-3xl font-bold text-white">
            {stats ? stats.total_users : "--"}
          </p>
        </div>
      </div>

      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaProjectDiagram className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Active Projects</h3>
          <p className="text-3xl font-bold text-white">
            {stats ? stats.active_projects : "--"}
          </p>
        </div>
      </div>

      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaSchool className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Constituencies</h3>
          <p className="text-3xl font-bold text-white">
            {stats ? stats.total_constituencies : "--"}
          </p>
        </div>
      </div>

      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaTasks className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Programs</h3>
          <p className="text-3xl font-bold text-white">
            {stats ? stats.total_programs : "--"}
          </p>
        </div>
      </div>

      <div className="bg-black rounded-lg shadow p-6 flex items-center gap-4">
        <FaClipboardCheck className="text-white text-4xl" />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Pending Approvals</h3>
          <p className="text-3xl font-bold text-white">
            {stats ? stats.pending_projects : "--"}
          </p>
        </div>
      </div>

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
